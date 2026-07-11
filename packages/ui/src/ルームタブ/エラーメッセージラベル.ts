import { SpanC } from "sengen-ui";
import * as styles from "./style.css";

// 送信フォームのエラー表示行（LV1拡張）。空文字ならCSSの :empty で消える
export class エラーメッセージラベル extends SpanC {
  constructor() {
    super({ class: styles.送信エラー表示 });
  }

  表示する(文言: string): this {
    this.setTextContent(文言);
    return this;
  }

  クリアする(): this {
    this.setTextContent("");
    return this;
  }
}
