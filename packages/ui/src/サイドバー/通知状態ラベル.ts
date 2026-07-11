import { SpanC } from "sengen-ui";
import * as styles from "./style.css";

// サイドバー下部、通知ボタンの下に置く小さな状態表示（LV1拡張）。
// 通知許可状態は重要度が低い情報のため、ステータスバー（廃止）ではなく
// ここに一時メッセージとして表示する。空文字なら:emptyでCSS側が非表示にする
export class 通知状態ラベル extends SpanC {
  constructor() {
    super({ class: styles.通知状態 });
  }

  表示する(文言: string): this {
    this.setTextContent(文言);
    return this;
  }
}
