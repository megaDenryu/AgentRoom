import {
  div,
  LV2HtmlComponentBase,
  配線ポート,
  type DivC,
  type I配線可能,
} from "sengen-ui";
import { メッセージ一覧領域, type タイムライン項目 } from "./メッセージ一覧領域";
import { 新着ジャンプボタン } from "./新着ジャンプボタン";
import type { メッセージ行View } from "./メッセージ行View";
import type { ルームタブ内容 } from "./ルームタブ内容";
import type { 未読区切りView } from "./未読区切りView";
import * as styles from "./style.css";

export interface Iタイムライン配線 {
  // 自動追従・手動スクロール・ジャンプボタンのいずれかで最下部に到達した
  // （既読位置送信の予約トリガー）
  on最下部到達(): void;
}

// メッセージ一覧のスクロール枠（LV2素部品）。自動追従（最下部張り付き）と
// 追従が切れている間の「新着N件」ジャンプボタンをここに閉じ込める
export class タイムラインView
  extends LV2HtmlComponentBase
  implements I配線可能<Iタイムライン配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iタイムライン配線>("タイムラインView");
  private readonly _一覧 = new メッセージ一覧領域();
  private readonly _ジャンプ: 新着ジャンプボタン;
  private _自動追従中 = true;
  private _未読件数 = 0;

  constructor(文言: ルームタブ内容) {
    super();
    this._ジャンプ = new 新着ジャンプボタン(文言);
    this._componentRoot = this._ルートを構築する(this._一覧, this._ジャンプ);
  }

  配線する(配線: Iタイムライン配線): this {
    this._配線.配線する(配線);
    return this;
  }

  private _ルートを構築する(一覧: メッセージ一覧領域, ジャンプ: 新着ジャンプボタン): DivC {
    return (
      div({ class: styles.タイムライン枠 }).childs([
          一覧.onScroll(() => this._スクロール位置から追従状態を更新する()),
          ジャンプ.onClick(() => this.最下部へ移動する())])
    );
  }

  全件を差し替える(項目一覧: readonly タイムライン項目[]): void {
    this._一覧.全件を差し替える(項目一覧);
    if (this._自動追従中) {
      this._一覧.scrollToBottom();
    }
  }

  // 区切りは装飾なので新着件数（ジャンプボタンの表示件数）に数えない
  追記する(行: メッセージ行View, 直前の区切り: 未読区切りView | null): void {
    this._一覧.追記する(直前の区切り === null ? [行] : [直前の区切り, 行]);
    if (this._自動追従中) {
      this._一覧.scrollToBottom();
      this._配線.先.on最下部到達();
      return;
    }
    this._未読件数 += 1;
    this._ジャンプ.未読件数を表示する(this._未読件数);
  }

  最下部にいるか(): boolean {
    return this._一覧.最下部付近にいるか();
  }

  最下部へ移動する(): void {
    this._一覧.scrollToBottom();
    this._自動追従を再開する();
    this._配線.先.on最下部到達();
  }

  private _スクロール位置から追従状態を更新する(): void {
    if (this._一覧.最下部付近にいるか()) {
      this._自動追従を再開する();
      this._配線.先.on最下部到達();
    } else {
      this._自動追従中 = false;
    }
  }

  private _自動追従を再開する(): void {
    this._自動追従中 = true;
    this._未読件数 = 0;
    this._ジャンプ.隠す();
  }
}
