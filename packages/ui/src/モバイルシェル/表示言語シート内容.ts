import { button, div, span, DivC } from "sengen-ui";
import { 現在ロケールを取得する, ロケールを保存する } from "../文言/現在ロケール";
import { ロケール一覧, ロケール表示名 } from "../文言/ロケール";
import { 言語選択状態 } from "./状態";
import * as styles from "./style.css";

// ボトムシートに差し込む「表示言語」の内容(モバイル専用のLV1拡張、Fudaba札#47)。
// 切替はlocalStorageへ保存後にページ再読み込みで反映する(文言/現在ロケール.ts参照。
// 動的な購読・再描画の仕組みは持たない設計方針)
export class 表示言語シート内容 extends DivC {
  constructor() {
    super({ class: styles.言語シート本体 });
    const 選択中 = 現在ロケールを取得する();
    this.childs([
      span({ text: "表示言語 / Language", class: styles.言語シート見出し }),
      div({ class: styles.言語選択行 }).childs(
        ロケール一覧.map((候補) =>
          button({ text: ロケール表示名[候補], class: styles.言語選択ボタン })
            .setAttribute(
              言語選択状態.attribute,
              候補 === 選択中 ? 言語選択状態.value.選択 : 言語選択状態.value.非選択,
            )
            .onClick(() => {
              ロケールを保存する(候補);
              window.location.reload();
            }),
        ),
      )]);
  }
}
