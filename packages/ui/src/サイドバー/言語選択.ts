import { SelectC } from "sengen-ui";
import { 現在ロケールを取得する, ロケールを保存する } from "../文言/現在ロケール";
import { ロケール一覧, ロケール値か, ロケール表示名 } from "../文言/ロケール";
import * as styles from "./style.css";

export class 言語選択 extends SelectC {
  constructor() {
    super({ options: ロケール一覧.map((value) => ({ value, text: ロケール表示名[value],
      selected: value === 現在ロケールを取得する() })), class: styles.言語セレクト });
    this.onSelectChange(() => {
      const value = this.getValue(); if (!ロケール値か(value)) return;
      ロケールを保存する(value); window.location.reload();
    });
  }
}
