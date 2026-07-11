import type { Relayクライアント } from "../通信/Relayクライアント";
import type { ルームタブ状態 } from "./ルームタブ状態";
import type { ルームタブ部品 } from "./ルームタブ部品";

const メンバー更新間隔ミリ秒 = 15_000;

// メンバー台帳をポーリングし、状態のメンバー種別・送信フォームの宛先候補に反映するサービス。
// 種別が変わったときは呼び出し側に通知し、表示済み行(HUMANバッジ)の作り直しを促す
export class メンバー同期サービス {
  private _タイマーID: number | null = null;
  private _前回の表現: string | null = null;

  constructor(
    private readonly _ルームID: string,
    private readonly _状態: ルームタブ状態,
    private readonly _部品: ルームタブ部品,
    private readonly _クライアント: Relayクライアント,
    private readonly _on種別変化: () => void,
  ) {}

  開始する(): void {
    void this._読み込む();
    this._タイマーID = window.setInterval(
      () => void this._読み込む(),
      メンバー更新間隔ミリ秒,
    );
  }

  dispose(): void {
    if (this._タイマーID !== null) {
      window.clearInterval(this._タイマーID);
      this._タイマーID = null;
    }
  }

  private async _読み込む(): Promise<void> {
    try {
      const 一覧 = await this._クライアント.メンバー一覧を取得する(this._ルームID);
      const 表現 = 一覧.map((メンバー) => `${メンバー.名前}\t${メンバー.種別}`).join("\n");
      if (表現 === this._前回の表現) return;
      this._前回の表現 = 表現;
      this._状態.メンバー種別.clear();
      for (const メンバー of 一覧) {
        this._状態.メンバー種別.set(メンバー.名前, メンバー.種別);
      }
      this._部品.送信フォーム.宛先候補を更新する(一覧.map((メンバー) => メンバー.名前));
      // HUMANバッジは行の構築時に決まるため、種別が変わったら全行を作り直す
      this._on種別変化();
    } catch (エラー: unknown) {
      console.error("メンバー一覧の取得に失敗しました", エラー);
    }
  }
}
