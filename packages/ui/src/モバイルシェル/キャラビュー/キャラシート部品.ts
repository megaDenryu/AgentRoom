import { button, select, textInput, textarea, type ButtonC, type SelectC, type TextAreaC, type TextInputC } from "sengen-ui";
import { キャラ種別一覧, type キャラDTO } from "../../通信/キャラ型";
import { エラー表示ラベル } from "../エラー表示ラベル";
import { キャラアイコン入力 } from "./キャラアイコン入力";
import type { キャラ入力 } from "./キャラシート内容";
import type { キャラ一覧内容 } from "./キャラ一覧内容";
import * as styles from "./style.css";

export class キャラシート部品 {
  readonly 名前: TextInputC; readonly 種別: SelectC; readonly アイコン: キャラアイコン入力;
  readonly プロンプト: TextAreaC; readonly 行動: TextAreaC; readonly エラー = new エラー表示ラベル();
  readonly 保存: ButtonC; readonly 削除: ButtonC | null; readonly 既存名: string | null;
  constructor(readonly 文言: キャラ一覧内容, existing?: キャラDTO) {
    this.既存名 = existing?.名前 ?? null; this.アイコン = new キャラアイコン入力(文言.アイコンalt);
    this.名前 = textInput({ placeholder: 文言.名前プレースホルダ, value: existing?.名前 ?? "",
      disabled: existing !== undefined, class: styles.入力 });
    this.種別 = select({ options: キャラ種別一覧.map((v) => ({ value: v, text: v,
      selected: v === (existing?.種別 ?? キャラ種別一覧[0]) })), class: styles.セレクト });
    this.プロンプト = textarea({ placeholder: 文言.プロンプトプレースホルダ,
      value: existing?.プロンプト ?? "", rows: 4, class: styles.テキストエリア });
    this.行動 = textarea({ placeholder: 文言.行動パターンプレースホルダ,
      value: existing?.行動パターンメモ ?? "", rows: 2, class: styles.テキストエリア });
    if ((existing?.アイコンdataUrl.length ?? 0) > 0) this.アイコン.値を設定する(existing?.アイコンdataUrl ?? "");
    this.保存 = button({ text: existing === undefined ? 文言.保存ボタン作成 : 文言.保存ボタン更新, class: styles.保存ボタン });
    this.削除 = existing === undefined ? null : button({ text: 文言.削除ボタン, class: styles.削除ボタン });
  }
  入力を取得する(): キャラ入力 | null {
    const 名前 = this.名前.getValue().trim();
    if (名前.length === 0) { this.エラー.表示する(this.文言.名前必須エラー); return null; }
    return { 名前, 種別: this.種別.getValue(), プロンプト: this.プロンプト.getValue(),
      アイコンdataUrl: this.アイコン.値を取得する(), 行動パターンメモ: this.行動.getValue() };
  }
}
