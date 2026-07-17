import { div, span, ButtonC, 配線ポート, type I配線可能 } from "sengen-ui";
import type { 下部ナビ項目定義 } from "./ナビ項目一覧";
import { ナビ選択状態 } from "./状態";
import * as styles from "./style.css";

export interface Iナビ項目ボタン配線 {
  on選択(): void;
}

// 下部ナビの1タブ(モバイル専用のLV1拡張)。選択中かどうかはdata-attributeで保持し、
// 実際の切り替えは下部ナビから選択する()/選択解除する()で指示を受けて反映するだけ
export class ナビ項目ボタン extends ButtonC implements I配線可能<Iナビ項目ボタン配線> {
  private readonly _配線 = new 配線ポート<Iナビ項目ボタン配線>("ナビ項目ボタン");
  private readonly _バッジ = span({ class: styles.ナビバッジ });
  readonly 項目id: string;

  constructor(項目: 下部ナビ項目定義) {
    super({ class: styles.ナビ項目 });
    this.項目id = 項目.id;
    this.setAttribute(ナビ選択状態.attribute, ナビ選択状態.value.非選択);
    this.onClick(() => this._配線.先.on選択()).childs([
        div({ class: styles.ナビアイコン枠 }).childs([
            項目.アイコン(22, "currentColor"),
            this._バッジ.setAttribute("data-visible", "false"),
            div({ class: styles.ナビ開花点 })]),
        span({ text: 項目.ラベル, class: styles.ナビラベル })]);
  }

  配線する(配線: Iナビ項目ボタン配線): this {
    this._配線.配線する(配線);
    return this;
  }

  選択する(): this {
    this.setAttribute(ナビ選択状態.attribute, ナビ選択状態.value.選択);
    return this;
  }

  選択解除する(): this {
    this.setAttribute(ナビ選択状態.attribute, ナビ選択状態.value.非選択);
    return this;
  }

  バッジ件数を設定する(件数: number): void {
    const 表示件数 = Math.max(0, Math.trunc(件数));
    this._バッジ.setTextContent(表示件数 > 99 ? "99+" : String(表示件数));
    this._バッジ.setAttribute("data-visible", 表示件数 > 0 ? "true" : "false");
  }
}
