import { span, DivC } from "sengen-ui";
import type { キャラ項目行 } from "./キャラ項目行";
import * as styles from "./style.css";

// キャラ一覧のスクロール領域(モバイル専用のLV1拡張)。更新のたびに全件差し替える
export class キャラ一覧領域 extends DivC {
  constructor() {
    super({ class: styles.リスト });
  }

  全件を差し替える(項目一覧: readonly キャラ項目行[]): this {
    this.clearChildren().childIfs([
      {
        If: 項目一覧.length === 0,
        True: () => span({ text: "キャラはまだ登録されていません", class: styles.空表示 }),
      },
      項目一覧]);
    return this;
  }
}
