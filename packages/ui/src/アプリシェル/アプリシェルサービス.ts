import { 狭幅ブレークポイントpx } from "../レスポンシブ";
import { ルームタブ } from "../ルームタブ/ルームタブ";
import type { 通知サービス, 通知許可状態 } from "../通知サービス";
import type { Relayクライアント } from "../通信/Relayクライアント";
import type { アプリシェル部品 } from "./アプリシェル部品";

// 将来ルーム以外のタブを足しても衝突しないよう、タブIDには種別プレフィックスを付ける
const ルームタブ接頭辞 = "ルーム:";

function 許可状態の表示文言(状態: 通知許可状態): string {
  switch (状態) {
    case "granted":
      return "デスクトップ通知: 有効";
    case "denied":
      return "デスクトップ通知: ブラウザで拒否されています（効果音のみ）";
    case "default":
      return "デスクトップ通知: 未許可（効果音のみ）";
    case "unsupported":
      return "デスクトップ通知: この環境では使えません（効果音のみ）";
  }
}

// アプリシェルのロジック層。ルームタブの開閉・選択の追従・通知許可の要求を担う
export class アプリシェルサービス {
  private readonly _開いているルームタブ = new Map<string, ルームタブ>();
  // 外殻レイアウトは選択中タブIDの取得APIを公開していないため、onタブ選択イベントで追跡する
  private _選択中タブid: string | null = null;

  private constructor(
    private readonly _部品: アプリシェル部品,
    private readonly _クライアント: Relayクライアント,
    private readonly _通知: 通知サービス,
  ) {}

  static 作る(依存: {
    部品: アプリシェル部品;
    クライアント: Relayクライアント;
    通知: 通知サービス;
  }): アプリシェルサービス {
    return new アプリシェルサービス(依存.部品, 依存.クライアント, 依存.通知);
  }

  ルームタブを開く(ルームID: string): void {
    const タブid = `${ルームタブ接頭辞}${ルームID}`;
    if (!this._部品.外殻.タブが存在するか(タブid)) {
      const タブ = new ルームタブ(ルームID, this._クライアント, this._通知);
      this._開いているルームタブ.set(タブid, タブ);
      this._部品.外殻.タブを追加する(タブid, ルームID, タブ);
    }
    this._部品.外殻.タブを選択する(タブid);
    // 狭幅では、ルーム選択は必ず開いているサイドバーからのクリックで起きる
    // （サイドバーが隠れている間はルーム項目自体が押せない）。選択直後に閉じることで
    // 会話タイムラインを全幅に戻す。デスクトップではサイドバーを開いたままにしたいため対象外
    if (window.innerWidth < 狭幅ブレークポイントpx) {
      this._部品.外殻.サイドバーを切り替える();
    }
  }

  // タブを閉じたらWS接続・タイマーも畳む
  タブを閉じる(タブid: string): void {
    this._開いているルームタブ.get(タブid)?.dispose();
    this._開いているルームタブ.delete(タブid);
    if (this._選択中タブid === タブid) {
      this._選択中タブid = null;
      this._部品.サイドバー.選択ルームを設定する(null);
    }
  }

  // タブ選択に追従して、サイドバーのメンバーパネル対象ルームを切り替える
  タブ選択を反映する(タブid: string): void {
    this._選択中タブid = タブid;
    this._部品.サイドバー.選択ルームを設定する(this._タブidからルームID(タブid));
  }

  // アクティビティバーの「ルーム」アイコンクリック。メニューバーを非表示運用にしているため
  // （アプリシェル部品参照）、サイドバーの開閉操作はこのアイコンが唯一の入口になる。
  // 狭幅では初期状態でサイドバーを閉じているため、開くための導線としてもここが必須
  アクティビティを選択する(): void {
    this._部品.外殻.サイドバーを切り替える();
    void this._部品.サイドバー.更新する();
  }

  // サイドバーのメンバークリックを、選択中ルームタブの1対1フィルタ切替に流す
  相手フィルタを切り替える(名前: string): void {
    if (this._選択中タブid === null) return;
    this._開いているルームタブ.get(this._選択中タブid)?.相手フィルタを切り替える(名前);
  }

  async 通知許可を要求する(): Promise<void> {
    const 状態 = await this._通知.許可を要求する();
    this._部品.サイドバー.通知状態を表示する(許可状態の表示文言(状態));
  }

  private _タブidからルームID(タブid: string): string | null {
    return タブid.startsWith(ルームタブ接頭辞)
      ? タブid.slice(ルームタブ接頭辞.length)
      : null;
  }
}
