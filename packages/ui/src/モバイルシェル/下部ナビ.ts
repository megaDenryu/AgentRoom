import {
  button,
  div,
  span,
  LV2HtmlComponentBase,
  配線ポート,
  type DivC,
  type I配線可能,
} from "sengen-ui";
import { 下部ナビ項目一覧 } from "./ナビ項目一覧";
import * as styles from "./style.css";

export interface I下部ナビ配線 {
  on項目選択(id: string): void;
}

// 下部固定のタブナビゲーション(LV2素部品)。項目は下部ナビ項目一覧.tsの配列だけで決まるため、
// 新しいタブは項目を1件追加するだけで増やせる。現状は「ルーム」1件のみなので、選択状態の
// 出し分けは行わず常時アクティブ表示にしている(2件目が増えたら選択状態管理を足す)
export class 下部ナビ extends LV2HtmlComponentBase implements I配線可能<I下部ナビ配線> {
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I下部ナビ配線>("下部ナビ");

  constructor() {
    super();
    this._componentRoot = this._ルートを構築する();
  }

  配線する(配線: I下部ナビ配線): this {
    this._配線.配線する(配線);
    return this;
  }

  private _ルートを構築する(): DivC {
    return (
      div({ class: styles.下部ナビ }).childs(
        下部ナビ項目一覧.map((項目) =>
          button({ class: styles.ナビ項目 })
            .onClick(() => this._配線.先.on項目選択(項目.id))
            .childs([
                div({ class: styles.ナビアイコン枠 }).childs([
                    項目.アイコン(22, "currentColor"),
                    div({ class: styles.ナビ開花点 })]),
                span({ text: 項目.ラベル, class: styles.ナビラベル })])))
    );
  }
}
