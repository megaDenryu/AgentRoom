import { button, select, textarea, textInput, type ButtonC, type SelectC, type TextAreaC, type TextInputC } from "sengen-ui";
import { 送信者名を読み込む } from "../送信者名記憶";
import { エラーメッセージラベル } from "./エラーメッセージラベル";
import type { ルームタブ内容 } from "./ルームタブ内容";
import * as styles from "./style.css";

export class 送信フォーム部品 {
  readonly 送信者: TextInputC; readonly 宛先: SelectC; readonly 本文: TextAreaC;
  readonly 送信: ButtonC; readonly エラー = new エラーメッセージラベル();
  constructor(readonly 文言: ルームタブ内容) {
    this.送信者 = textInput({ value: 送信者名を読み込む(),
      placeholder: 文言.送信者名プレースホルダ, class: styles.送信者名入力 });
    this.宛先 = select({ options: [{ value: "", text: 文言.全員宛ラベル }], class: styles.宛先セレクト });
    this.本文 = textarea({ rows: 2, placeholder: 文言.本文入力プレースホルダ, class: styles.本文入力 });
    this.送信 = button({ text: 文言.送信ボタン, class: styles.送信ボタン });
  }
}
