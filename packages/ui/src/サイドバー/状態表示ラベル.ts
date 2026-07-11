import { DivC } from "sengen-ui";
import * as styles from "./style.css";

// サイドバーの通信エラー表示行（LV1拡張）。空文字ならCSSの :empty で消える
export class 状態表示ラベル extends DivC {
  constructor() {
    super({ class: styles.状態表示 });
  }

  エラーを表示する(文言: string): this {
    this.setTextContent(文言);
    return this;
  }

  クリアする(): this {
    this.setTextContent("");
    return this;
  }
}
