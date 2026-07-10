import { span, LV2HtmlComponentBase, type SpanC } from "sengen-ui";
import {
  外殻レイアウト,
  アクティビティID,
} from "vscode-shell-layout";
import { ルームアイコン } from "./アイコン";
import { ルームタブ } from "./ルームタブ";
import { ルーム一覧サイドバー } from "./ルーム一覧サイドバー";
import type { Relayクライアント } from "./通信/Relayクライアント";

const ルームアクティビティ = アクティビティID("ルーム");

// アプリ全体のOrchestrator。外殻レイアウトの各スロットへの注入と、
// サイドバー・シェルイベントの配線をここに集約する
export class アプリシェル extends LV2HtmlComponentBase {
  protected _componentRoot: 外殻レイアウト;
  private readonly _サイドバー: ルーム一覧サイドバー;
  private readonly _ステータス表示: SpanC;
  private readonly _開いているルームタブ = new Map<string, ルームタブ>();

  constructor(private readonly _クライアント: Relayクライアント) {
    super();
    this._サイドバー = new ルーム一覧サイドバー(this._クライアント);
    this._ステータス表示 = span({ text: "" });
    this._componentRoot = this.createComponentRoot();
    this._購読を配線する();
  }

  protected createComponentRoot(): 外殻レイアウト {
    return new 外殻レイアウト({
      タイトル: "AgentRoom",
      アクティビティ項目一覧: [
        { id: ルームアクティビティ, ラベル: "ルーム", アイコン: ルームアイコン },
      ],
      右サイドバー有効: true,
      パネル初期表示: false,
      右サイドバー内容: this._サイドバー,
      ステータスバー左: this._ステータス表示,
      ステータスバー右テキスト: "AgentRoom",
    });
  }

  private _購読を配線する(): void {
    this._サイドバー.onルーム選択((ルームID) => this.ルームタブを開く(ルームID));

    this._componentRoot.onタブイベント({
      onタブ選択: () => {},
      onタブ閉じる: (タブid) => {
        // タブを閉じたらWS接続も畳む
        this._開いているルームタブ.get(タブid)?.dispose();
        this._開いているルームタブ.delete(タブid);
      },
    });

    this._componentRoot.onアクティビティ選択(() => {
      void this._サイドバー.更新する();
    });

    // 設定画面は未実装。クリックで何も起きない状態を避けるためステータスバーに表示する
    this._componentRoot.on設定クリック(() => {
      this._ステータス表示.setTextContent("設定は未実装です");
    });
  }

  ルームタブを開く(ルームID: string): void {
    // 将来ルーム以外のタブを足しても衝突しないよう、タブIDには種別プレフィックスを付ける
    const タブid = `ルーム:${ルームID}`;
    if (!this._componentRoot.タブが存在するか(タブid)) {
      const タブ = new ルームタブ(ルームID, this._クライアント);
      this._開いているルームタブ.set(タブid, タブ);
      this._componentRoot.タブを追加する(タブid, ルームID, タブ);
    }
    this._componentRoot.タブを選択する(タブid);
  }
}
