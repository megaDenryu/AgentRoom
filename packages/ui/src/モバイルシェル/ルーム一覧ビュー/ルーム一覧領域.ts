import { div, span, DivC } from "sengen-ui";
import { ルームアイコン } from "../../アイコン";
import type { ルーム一覧内容 } from "./ルーム一覧内容";
import type { ルーム項目行 } from "./ルーム項目行";
import * as styles from "./style.css";

// ルーム一覧のスクロール領域(モバイル専用のLV1拡張)。更新のたびに全件差し替える
export class ルーム一覧領域 extends DivC {
  constructor(private readonly _文言: ルーム一覧内容) {
    super({ class: styles.リスト });
  }

  全件を差し替える(項目一覧: readonly ルーム項目行[]): this {
    this.clearChildren().childIfs([
      {
        If: 項目一覧.length === 0,
        True: () =>
          div({ class: styles.空表示 }).childs([
              div({ class: styles.空表示アイコン枠 }).child(ルームアイコン(24, "currentColor")),
              span({ text: this._文言.空表示見出し, class: styles.空表示見出し }),
              span({ text: this._文言.空表示キャプション, class: styles.空表示キャプション })]),
      },
      項目一覧]);
    return this;
  }
}
