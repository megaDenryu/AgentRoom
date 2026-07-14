import {
  button,
  div,
  select,
  span,
  textInput,
  textarea,
  LV2HtmlComponentBase,
  配線ポート,
  type ButtonC,
  type DivC,
  type I配線可能,
  type SelectC,
  type TextAreaC,
  type TextInputC,
} from "sengen-ui";
import { キャラ種別一覧, type キャラDTO } from "../通信/キャラ型";
import { キャラアイコン入力 } from "./キャラアイコン入力";
import type { キャラタブ内容 } from "./キャラタブ内容";
import * as styles from "./style.css";

export interface キャラ入力 {
  readonly 名前: string;
  readonly 種別: string;
  readonly プロンプト: string;
  readonly アイコンdataUrl: string;
  readonly 行動パターンメモ: string;
}

export interface Iキャラフォーム配線 {
  on保存(入力: キャラ入力): void;
  onキャンセル(): void;
}

// キャラの作成・編集フォーム(LV2素部品)。同一フォームを作成/編集の両方に使い回し、
// 編集内容を設定する(キャラ)で既存値を流し込んだときだけ名前入力を固定する
// (名前はキャラの識別キーのため、改名は削除+再作成で行う運用)
export class キャラフォーム extends LV2HtmlComponentBase implements I配線可能<Iキャラフォーム配線> {
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iキャラフォーム配線>("キャラフォーム");
  private readonly _名前入力: TextInputC;
  private readonly _種別セレクト: SelectC;
  private readonly _アイコン入力: キャラアイコン入力;
  private readonly _プロンプト入力: TextAreaC;
  private readonly _行動パターン入力: TextAreaC;
  private readonly _保存ボタン: ButtonC;

  constructor(private readonly _文言: キャラタブ内容) {
    super();
    this._アイコン入力 = new キャラアイコン入力(_文言.アイコンalt);
    this._名前入力 = textInput({ placeholder: _文言.名前プレースホルダ, class: styles.入力 });
    this._種別セレクト = select({
      options: キャラ種別一覧.map((種別) => ({ value: 種別, text: 種別 })),
      class: styles.セレクト,
    });
    this._プロンプト入力 = textarea({
      placeholder: _文言.プロンプトプレースホルダ,
      rows: 4,
      class: styles.テキストエリア,
    });
    this._行動パターン入力 = textarea({
      placeholder: _文言.行動パターンプレースホルダ,
      rows: 2,
      class: styles.テキストエリア,
    });
    this._保存ボタン = button({ text: _文言.保存ボタン作成, class: styles.保存ボタン }).onClick(
      () => this._保存を発火する(),
    );
    this._componentRoot = this._ルートを構築する();
  }

  配線する(配線: Iキャラフォーム配線): this {
    this._配線.配線する(配線);
    return this;
  }

  編集内容を設定する(キャラ: キャラDTO): void {
    this._名前入力.setValue(キャラ.名前).setDisabled(true);
    this._種別セレクト.setValue(キャラ.種別);
    this._プロンプト入力.setValue(キャラ.プロンプト);
    this._アイコン入力.値を設定する(キャラ.アイコンdataUrl);
    this._行動パターン入力.setValue(キャラ.行動パターンメモ);
    this._保存ボタン.setTextContent(this._文言.保存ボタン更新);
  }

  クリアする(): void {
    this._名前入力.setValue("").setDisabled(false);
    this._種別セレクト.setValue(キャラ種別一覧[0]);
    this._プロンプト入力.setValue("");
    this._アイコン入力.値を設定する("");
    this._行動パターン入力.setValue("");
    this._保存ボタン.setTextContent(this._文言.保存ボタン作成);
  }

  private _ルートを構築する(): DivC {
    return (
      div({ class: styles.フォーム側 }).childs([
          span({ text: this._文言.フォーム見出し, class: styles.見出し }),
          this._名前入力,
          this._種別セレクト,
          this._アイコン入力,
          this._プロンプト入力,
          this._行動パターン入力,
          this._保存ボタン,
          button({ text: this._文言.キャンセルボタン, class: styles.キャンセルボタン }).onClick(
            () => {
              this.クリアする();
              this._配線.先.onキャンセル();
            },
          )])
    );
  }

  private _保存を発火する(): void {
    const 名前 = this._名前入力.getValue().trim();
    if (名前.length === 0) return;
    this._配線.先.on保存({
      名前,
      種別: this._種別セレクト.getValue(),
      プロンプト: this._プロンプト入力.getValue(),
      アイコンdataUrl: this._アイコン入力.値を取得する(),
      行動パターンメモ: this._行動パターン入力.getValue(),
    });
  }
}
