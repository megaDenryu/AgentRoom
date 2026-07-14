import { div, LV2HtmlComponentBase, type DivC } from "sengen-ui";
import type { 会話内容 } from "./会話内容";
import { メッセージ一覧内側 } from "./メッセージ一覧内側";
import type { メッセージ行 } from "./メッセージ行";
import { 新着ジャンプボタン } from "./新着ジャンプボタン";
import * as styles from "./style.css";

// メッセージ一覧のスクロール枠(モバイル専用のLV2素部品)。自動追従(最下部張り付き)と、
// 追従が切れている間の「新着N件」ジャンプボタンをここに閉じ込める。
// フィルタ・既読位置送信はモバイル版のスコープ外のため、デスクトップのタイムラインViewより
// 単純な「追記するだけ」の構造にしている
export class メッセージ一覧 extends LV2HtmlComponentBase {
  protected _componentRoot: DivC;
  private readonly _一覧 = new メッセージ一覧内側();
  private readonly _ジャンプ: 新着ジャンプボタン;

  private _自動追従中 = true;
  private _未読件数 = 0;

  constructor(文言: 会話内容) {
    super();
    this._ジャンプ = new 新着ジャンプボタン(文言);
    this._componentRoot = this._ルートを構築する(this._一覧, this._ジャンプ);
  }

  追記する(行: メッセージ行): void {
    this._一覧.追記する(行);
    if (this._自動追従中) {
      this._一覧.最下部へスクロールする();
      return;
    }
    this._未読件数 += 1;
    this._ジャンプ.未読件数を表示する(this._未読件数);
  }

  private _ルートを構築する(一覧: メッセージ一覧内側, ジャンプ: 新着ジャンプボタン): DivC {
    return (
      div({ class: styles.枠 }).childs([
          一覧.onScroll(() => this._スクロール位置から追従状態を更新する()),
          ジャンプ.onClick(() => this._最下部へ移動する())])
    );
  }

  private _最下部へ移動する(): void {
    this._一覧.最下部へスクロールする();
    this._自動追従中 = true;
    this._未読件数 = 0;
    this._ジャンプ.隠す();
  }

  private _スクロール位置から追従状態を更新する(): void {
    if (this._一覧.最下部付近にいるか()) {
      this._自動追従中 = true;
      this._未読件数 = 0;
      this._ジャンプ.隠す();
    } else {
      this._自動追従中 = false;
    }
  }
}
