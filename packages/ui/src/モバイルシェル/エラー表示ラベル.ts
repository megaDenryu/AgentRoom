import { SpanC } from "sengen-ui";
import * as styles from "./style.css";

// エラー・状態メッセージの1行表示(LV1拡張)。空文字ならCSSの:emptyで消える。
// ルーム一覧ビュー・会話ビューの双方から使う共通の小部品
export class エラー表示ラベル extends SpanC {
  constructor() {
    super({ class: styles.エラー表示 });
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
