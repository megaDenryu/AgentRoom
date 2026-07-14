import { span, DivC } from "sengen-ui";
import type { サイドバー内容 } from "./サイドバー内容";
import type { 稼働状況行View } from "./稼働状況行View";
import * as styles from "./style.css";

// 稼働状況一覧の表示領域（LV1拡張）。メンバー一覧領域と同型
export class 稼働状況一覧領域 extends DivC {
  constructor(private readonly _文言: サイドバー内容) {
    super({ class: styles.稼働状況一覧領域 });
    this.空を表示する();
  }

  全件を差し替える(項目一覧: readonly 稼働状況行View[]): this {
    this.clearChildren().childIfs([
      {
        If: 項目一覧.length === 0,
        True: () => span({ text: this._文言.稼働状況空表示, class: styles.空表示 }),
      },
      項目一覧]);
    return this;
  }

  空を表示する(): this {
    this.clearChildren().child(
      span({ text: this._文言.稼働状況空表示, class: styles.空表示 }),
    );
    return this;
  }
}
