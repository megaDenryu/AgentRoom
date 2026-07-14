import { button, div, img, span, DivC, 配線ポート, type I配線可能 } from "sengen-ui";
import type { キャラ稼働合成 } from "../キャラ/キャラ稼働合成";
import { キャラ種別色を返す } from "../キャラ種別配色";
import { 稼働状況色を返す } from "../稼働状況配色";
import * as styles from "./style.css";

export interface Iキャラ項目配線 {
  on編集(): void;
  on削除(): void;
}

// キャラ一覧の1行(LV1拡張の行View)。アイコン+名前+種別バッジ+稼働状況バッジ(presence)
// +行動パターンメモ+編集/削除ボタン。一覧更新のたびに作り直されるため構築時データで完結する
export class キャラ項目View extends DivC implements I配線可能<Iキャラ項目配線> {
  private readonly _配線 = new 配線ポート<Iキャラ項目配線>("キャラ項目View");

  constructor(合成: キャラ稼働合成) {
    super({ class: styles.項目 });
    const { キャラ, 稼働状態, 参加ルーム一覧 } = 合成;
    const 稼働色 = 稼働状態 !== null ? 稼働状況色を返す(稼働状態) : "transparent";
    this.setCssVariable("--chara-type-color", キャラ種別色を返す(キャラ.種別))
      .setCssVariable("--chara-presence-color", 稼働色)
      .childs([
        img({ src: キャラ.アイコンdataUrl, alt: キャラ.名前, class: styles.項目アイコン }),
        div({ class: styles.項目本文 }).childIfs([
            div({ class: styles.項目名行 }).childIfs([
                span({ text: キャラ.名前, class: styles.項目名 }),
                span({ text: キャラ.種別, class: styles.種別バッジ }),
                {
                  If: 稼働状態 !== null,
                  True: () => span({ text: 稼働状態 ?? "", class: styles.稼働バッジ }),
                  False: () => span({ text: "未申告", class: styles.未申告バッジ }),
                }]),
            div({ class: styles.行動メモ, text: キャラ.行動パターンメモ }),
            {
              If: 参加ルーム一覧.length > 0,
              True: () =>
                span({
                  text: `参加中のルーム: ${参加ルーム一覧.join(", ")}`,
                  class: styles.参加ルーム行,
                }),
            }]),
        div({ class: styles.項目ボタン列 }).childs([
            button({ text: "編集", class: styles.編集ボタン }).onClick(() =>
              this._配線.先.on編集(),
            ),
            button({ text: "削除", class: styles.削除ボタン }).onClick(() =>
              this._配線.先.on削除(),
            )])]);
  }

  配線する(配線: Iキャラ項目配線): this {
    this._配線.配線する(配線);
    return this;
  }
}
