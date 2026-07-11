import { button, span, DivC, 配線ポート, type I配線可能 } from "sengen-ui";
import * as styles from "./style.css";

export interface Iフィルタバナー配線 {
  on解除(): void;
}

// 1対1フィルタ適用中に表示するバナー（LV1拡張）。表示のたびに子を作り直すことで、
// 文言用ラベルのフィールド保持を避ける
export class フィルタバナー extends DivC implements I配線可能<Iフィルタバナー配線> {
  private readonly _配線 = new 配線ポート<Iフィルタバナー配線>("フィルタバナー");

  constructor() {
    super({ class: styles.フィルタバナー });
    this.setAttribute("data-visible", "false");
  }

  配線する(配線: Iフィルタバナー配線): this {
    this._配線.配線する(配線);
    return this;
  }

  表示する(相手名: string): this {
    this.clearChildren().childs([
      span({ text: `「${相手名}」との1対1の会話だけを表示しています` }),
      button({ text: "解除", class: styles.フィルタ解除ボタン }).onClick(() =>
        this._配線.先.on解除(),
      )]);
    this.setAttribute("data-visible", "true");
    return this;
  }

  隠す(): this {
    this.setAttribute("data-visible", "false");
    return this;
  }
}
