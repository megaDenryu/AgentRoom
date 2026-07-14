import { ButtonC } from "sengen-ui";
import type { ルームタブ内容 } from "./ルームタブ内容";
import * as styles from "./style.css";

// タイムライン右下に浮かぶ「最下部へ」ボタン（LV1拡張）。
// 自動追従が切れている間の未読件数表示を兼ねる
export class 新着ジャンプボタン extends ButtonC {
  constructor(private readonly _文言: ルームタブ内容) {
    super({ text: _文言.最下部へボタン, class: styles.新着ジャンプボタン });
    this.setAttribute("data-visible", "false");
  }

  未読件数を表示する(件数: number): this {
    this.setTextContent(this._文言.新着件数表示(件数));
    this.setAttribute("data-visible", "true");
    return this;
  }

  隠す(): this {
    this.setAttribute("data-visible", "false");
    return this;
  }
}
