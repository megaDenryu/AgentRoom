import { div, LV2HtmlComponentBase, type DivC, type HtmlComponentChild } from "sengen-ui";
import { シート表示状態 } from "./状態";
import * as styles from "./style.css";

// 会話ビューの「送信設定」など、複数の画面から共有して使う汎用ボトムシート(LV2素部品)。
// 内容は開くたびに差し替える。背景タップでも閉じられる(頻出パターン集第5章のアニメーション
// パターンに従い、data-attributeの切替だけで開閉のトランジションを表現する)。
// 開閉は呼び出し側が直接メソッドで指示するだけで、上方向イベントを必要とする消費者が
// 現状いないため配線ポート(第11条)は持たない
export class ボトムシート extends LV2HtmlComponentBase {
  protected _componentRoot: DivC;
  private readonly _内容枠: DivC;

  constructor() {
    super();
    this._内容枠 = div();
    this._componentRoot = this._ルートを構築する(this._内容枠);
  }

  開く(内容: HtmlComponentChild): void {
    this._内容枠.clearChildren().child(内容);
    this._componentRoot.setAttribute(
      シート表示状態.attribute,
      シート表示状態.value.表示,
    );
  }

  閉じる(): void {
    this._componentRoot.setAttribute(
      シート表示状態.attribute,
      シート表示状態.value.非表示,
    );
  }

  private _ルートを構築する(内容枠: DivC): DivC {
    return (
      div({ class: styles.オーバーレイ })
        .setAttribute(シート表示状態.attribute, シート表示状態.value.非表示)
        .onClick(() => this.閉じる())
        .child(
          div({ class: styles.シート })
            .onClick((イベント) => イベント.stopPropagation())
            .childs([div({ class: styles.シートつまみ }), 内容枠]))
    );
  }
}
