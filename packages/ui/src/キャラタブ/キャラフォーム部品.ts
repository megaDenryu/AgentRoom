import { button, select, textInput, textarea, type ButtonC, type SelectC, type TextAreaC, type TextInputC } from "sengen-ui";
import { キャラ種別一覧, type キャラDTO } from "../通信/キャラ型";
import { キャラアイコン入力 } from "./キャラアイコン入力";
import type { キャラ入力 } from "./キャラフォーム";
import type { キャラタブ内容 } from "./キャラタブ内容";
import * as styles from "./style.css";

export class キャラフォーム部品 {
  readonly 名前: TextInputC; readonly 種別: SelectC; readonly アイコン: キャラアイコン入力;
  readonly プロンプト: TextAreaC; readonly 行動: TextAreaC; readonly 保存: ButtonC;
  readonly キャンセル: ButtonC;
  constructor(private readonly _文言: キャラタブ内容) {
    this.アイコン = new キャラアイコン入力(_文言.アイコンalt);
    this.名前 = textInput({ placeholder: _文言.名前プレースホルダ, class: styles.入力 });
    this.種別 = select({ options: キャラ種別一覧.map((v) => ({ value: v, text: v })), class: styles.セレクト });
    this.プロンプト = textarea({ placeholder: _文言.プロンプトプレースホルダ, rows: 4, class: styles.テキストエリア });
    this.行動 = textarea({ placeholder: _文言.行動パターンプレースホルダ, rows: 2, class: styles.テキストエリア });
    this.保存 = button({ text: _文言.保存ボタン作成, class: styles.保存ボタン });
    this.キャンセル = button({ text: _文言.キャンセルボタン, class: styles.キャンセルボタン });
  }
  編集を設定する(chara: キャラDTO): void {
    this.名前.setValue(chara.名前).setDisabled(true); this.種別.setValue(chara.種別);
    this.プロンプト.setValue(chara.プロンプト); this.アイコン.値を設定する(chara.アイコンdataUrl);
    this.行動.setValue(chara.行動パターンメモ); this.保存.setTextContent(this._文言.保存ボタン更新);
  }
  クリアする(): void {
    this.名前.setValue("").setDisabled(false); this.種別.setValue(キャラ種別一覧[0]);
    this.プロンプト.setValue(""); this.アイコン.値を設定する(""); this.行動.setValue("");
    this.保存.setTextContent(this._文言.保存ボタン作成);
  }
  入力を取得する(): キャラ入力 | null {
    const 名前 = this.名前.getValue().trim();
    return 名前.length === 0 ? null : { 名前, 種別: this.種別.getValue(),
      プロンプト: this.プロンプト.getValue(), アイコンdataUrl: this.アイコン.値を取得する(),
      行動パターンメモ: this.行動.getValue() };
  }
}
