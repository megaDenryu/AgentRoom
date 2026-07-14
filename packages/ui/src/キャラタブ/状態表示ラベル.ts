import { DivC } from "sengen-ui";
import * as styles from "./style.css";

// キャラタブの通信エラー表示行(LV1拡張)。空文字ならCSSの:emptyで消える
// (サイドバー/状態表示ラベル.tsと同型。タブは独立部品のため個別に持つ)
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
