import { ButtonC } from "sengen-ui";
import * as styles from "./style.css";

// タイムライン右下に浮かぶ「最下部へ」ボタン（LV1拡張）。
// 自動追従が切れている間の未読件数表示を兼ねる
export class 新着ジャンプボタン extends ButtonC {
  constructor() {
    super({ text: "最下部へ", class: styles.新着ジャンプボタン });
    this.setAttribute("data-visible", "false");
  }

  未読件数を表示する(件数: number): this {
    this.setTextContent(`新着${件数}件`);
    this.setAttribute("data-visible", "true");
    return this;
  }

  隠す(): this {
    this.setAttribute("data-visible", "false");
    return this;
  }
}
