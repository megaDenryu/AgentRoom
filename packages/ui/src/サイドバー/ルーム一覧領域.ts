import { span, DivC } from "sengen-ui";
import type { ルーム項目View } from "./ルーム項目View";
import * as styles from "./style.css";

// ルーム一覧のスクロール領域（LV1拡張）。更新のたびに全件差し替える
export class ルーム一覧領域 extends DivC {
  constructor() {
    super({ class: styles.一覧領域 });
  }

  全件を差し替える(項目一覧: readonly ルーム項目View[]): this {
    this.clearChildren().childIfs([
      {
        If: 項目一覧.length === 0,
        True: () => span({ text: "ルームはまだありません", class: styles.空表示 }),
      },
      項目一覧]);
    return this;
  }
}
