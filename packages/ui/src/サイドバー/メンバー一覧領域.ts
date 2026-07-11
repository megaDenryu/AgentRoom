import { span, DivC } from "sengen-ui";
import type { メンバー項目View } from "./メンバー項目View";
import * as styles from "./style.css";

// 選択中ルームのメンバー一覧領域（LV1拡張）。ルーム未選択時は案内文を出す
export class メンバー一覧領域 extends DivC {
  constructor() {
    super({ class: styles.メンバー一覧領域 });
    this.未選択を表示する();
  }

  全件を差し替える(項目一覧: readonly メンバー項目View[]): this {
    this.clearChildren().childIfs([
      {
        If: 項目一覧.length === 0,
        True: () => span({ text: "メンバーはいません", class: styles.空表示 }),
      },
      項目一覧]);
    return this;
  }

  未選択を表示する(): this {
    this.clearChildren().child(
      span({ text: "ルームを選択するとメンバーが表示されます", class: styles.空表示 }),
    );
    return this;
  }
}
