import { span, DivC } from "sengen-ui";
import type { サイドバー内容 } from "./サイドバー内容";
import type { ルーム項目View } from "./ルーム項目View";
import * as styles from "./style.css";

// ルーム一覧のスクロール領域（LV1拡張）。更新のたびに全件差し替える
export class ルーム一覧領域 extends DivC {
  constructor(private readonly _文言: サイドバー内容) {
    super({ class: styles.一覧領域 });
  }

  全件を差し替える(項目一覧: readonly ルーム項目View[]): this {
    this.clearChildren().childIfs([
      {
        If: 項目一覧.length === 0,
        True: () => span({ text: this._文言.ルーム空表示, class: styles.空表示 }),
      },
      項目一覧]);
    return this;
  }
}
