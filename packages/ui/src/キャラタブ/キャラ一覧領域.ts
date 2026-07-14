import { span, DivC } from "sengen-ui";
import type { キャラタブ内容 } from "./キャラタブ内容";
import type { キャラ項目View } from "./キャラ項目View";
import * as styles from "./style.css";

// キャラ一覧の表示領域(LV1拡張)。稼働状況一覧領域/メンバー一覧領域と同型
export class キャラ一覧領域 extends DivC {
  constructor(private readonly _文言: キャラタブ内容) {
    super({ class: styles.一覧領域 });
    this.空を表示する();
  }

  全件を差し替える(項目一覧: readonly キャラ項目View[]): this {
    this.clearChildren().childIfs([
      {
        If: 項目一覧.length === 0,
        True: () => span({ text: this._文言.空表示, class: styles.空表示 }),
      },
      項目一覧]);
    return this;
  }

  空を表示する(): this {
    this.clearChildren().child(span({ text: this._文言.空表示, class: styles.空表示 }));
    return this;
  }
}
