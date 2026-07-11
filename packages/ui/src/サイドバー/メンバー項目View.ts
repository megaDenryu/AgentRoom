import { button, span, DivC, 配線ポート, type I配線可能 } from "sengen-ui";
import { 種別色を返す } from "../種別配色";
import type { メンバーDTO } from "../通信/メッセージ型";
import * as styles from "./style.css";

export interface Iメンバー項目配線 {
  // 行クリック = そのメンバーとの1対1フィルタ切替
  on選択(): void;
  on削除(): void;
}

// メンバー一覧の1行（LV1拡張の行View）。名前+種別バッジ（色分け+種別名併記）+削除ボタン
export class メンバー項目View extends DivC implements I配線可能<Iメンバー項目配線> {
  private readonly _配線 = new 配線ポート<Iメンバー項目配線>("メンバー項目View");

  constructor(メンバー: メンバーDTO) {
    super({ class: styles.メンバー項目 });
    this.setCssVariable("--member-type-color", 種別色を返す(メンバー.種別))
      .onClick(() => this._配線.先.on選択())
      .childs([
        span({ text: メンバー.名前, class: styles.メンバー名 }),
        span({ text: メンバー.種別, class: styles.種別バッジ }),
        button({ text: "削除", class: styles.メンバー削除ボタン }).onClick((イベント) => {
          // 行クリック（フィルタ切替）に化けないよう伝播を止める
          イベント.stopPropagation();
          this._配線.先.on削除();
        })]);
  }

  配線する(配線: Iメンバー項目配線): this {
    this._配線.配線する(配線);
    return this;
  }
}
