import {
  button,
  div,
  textarea,
  LV2HtmlComponentBase,
  配線ポート,
  type ButtonC,
  type DivC,
  type I配線可能,
  type TextAreaC,
} from "sengen-ui";
import * as styles from "./style.css";

export interface I送信バー配線 {
  on送信(本文: string): void;
  on設定を開く(): void;
}

// 会話ビュー下部の入力バー(LV2素部品)。送信者名の変更は「設定」ボタンから開く
// ボトムシート(送信設定シート内容)に追い出し、本文入力+送信ボタンだけに絞っている。
// タップ操作が主のモバイルではコンポーズ欄は単純なほど使いやすいという判断
export class 送信バー extends LV2HtmlComponentBase implements I配線可能<I送信バー配線> {
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I送信バー配線>("送信バー");
  private readonly _本文入力: TextAreaC;
  private readonly _送信ボタン: ButtonC;

  constructor() {
    super();
    this._本文入力 = textarea({
      rows: 1,
      placeholder: "メッセージを入力",
      class: styles.本文入力,
    });
    this._送信ボタン = button({ text: "送信", class: styles.送信ボタン }).onClick(() =>
      this._送信を発火する(),
    );
    this._componentRoot = this._ルートを構築する(this._本文入力, this._送信ボタン);
  }

  配線する(配線: I送信バー配線): this {
    this._配線.配線する(配線);
    return this;
  }

  送信中にする(送信中: boolean): void {
    this._送信ボタン.setDisabled(送信中);
  }

  本文をクリアする(): void {
    this._本文入力.setValue("");
  }

  private _ルートを構築する(本文入力: TextAreaC, 送信ボタン: ButtonC): DivC {
    return (
      div({ class: styles.送信バー }).childs([
          button({ text: "設定", class: styles.設定ボタン }).onClick(() =>
            this._配線.先.on設定を開く(),
          ),
          本文入力,
          送信ボタン])
    );
  }

  private _送信を発火する(): void {
    const 本文 = this._本文入力.getValue().trim();
    if (本文.length === 0) return;
    this._配線.先.on送信(本文);
  }
}
