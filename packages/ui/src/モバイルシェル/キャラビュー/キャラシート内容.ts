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
import { キャラ種別一覧, type キャラDTO } from "../../通信/キャラ型";
import { エラー表示ラベル } from "../エラー表示ラベル";
import { キャラアイコン入力 } from "./キャラアイコン入力";
import * as styles from "./style.css";

export interface キャラ入力 {
  readonly 名前: string;
  readonly 種別: string;
  readonly プロンプト: string;
  readonly アイコンdataUrl: string;
  readonly 行動パターンメモ: string;
}

export interface Iキャラシート内容配線 {
  on保存(入力: キャラ入力): void;
  on削除(名前: string): void;
}

// ボトムシートに差し込む「キャラの作成・編集」内容(モバイル専用のLV2素部品)。
// 既存キャラを渡せば編集モード(名前固定+削除ボタン表示)、省略すれば新規作成モードになる
export class キャラシート内容
  extends LV2HtmlComponentBase
  implements I配線可能<Iキャラシート内容配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iキャラシート内容配線>("キャラシート内容");
  private readonly _名前入力: TextInputC;
  private readonly _種別セレクト: SelectC;
  private readonly _アイコン入力 = new キャラアイコン入力();
  private readonly _プロンプト入力: TextAreaC;
  private readonly _行動パターン入力: TextAreaC;
  private readonly _エラー表示 = new エラー表示ラベル();
  private readonly _保存ボタン: ButtonC;
  private readonly _既存名: string | null;

  constructor(既存?: キャラDTO) {
    super();
    this._既存名 = 既存?.名前 ?? null;
    this._名前入力 = textInput({
      placeholder: "キャラ名",
      value: 既存?.名前 ?? "",
      disabled: 既存 !== undefined,
      class: styles.入力,
    });
    this._種別セレクト = select({
      options: キャラ種別一覧.map((種別) => ({
        value: 種別,
        text: 種別,
        selected: 種別 === (既存?.種別 ?? キャラ種別一覧[0]),
      })),
      class: styles.セレクト,
    });
    this._プロンプト入力 = textarea({
      placeholder: "プロンプト",
      value: 既存?.プロンプト ?? "",
      rows: 4,
      class: styles.テキストエリア,
    });
    this._行動パターン入力 = textarea({
      placeholder: "行動パターンメモ",
      value: 既存?.行動パターンメモ ?? "",
      rows: 2,
      class: styles.テキストエリア,
    });
    if (既存 !== undefined && 既存.アイコンdataUrl.length > 0) {
      this._アイコン入力.値を設定する(既存.アイコンdataUrl);
    }
    this._保存ボタン = button({
      text: 既存 === undefined ? "作成" : "更新",
      class: styles.保存ボタン,
    }).onClick(() => this._保存を発火する());
    this._componentRoot = this._ルートを構築する();
  }

  配線する(配線: Iキャラシート内容配線): this {
    this._配線.配線する(配線);
    return this;
  }

  エラーを表示する(文言: string): void {
    this._エラー表示.表示する(文言);
  }

  保存中にする(保存中: boolean): void {
    this._保存ボタン.setDisabled(保存中);
  }

  private _ルートを構築する(): DivC {
    return (
      div({ class: styles.シート本体 }).childs([
          span({
            text: this._既存名 === null ? "キャラを作成" : "キャラを編集",
            class: styles.シート見出し,
          }),
          this._名前入力,
          this._種別セレクト,
          this._アイコン入力,
          this._プロンプト入力,
          this._行動パターン入力,
          this._エラー表示,
          div({ class: styles.ボタン行 }).childIfs([
              this._保存ボタン,
              {
                If: this._既存名 !== null,
                True: () =>
                  button({ text: "削除", class: styles.削除ボタン }).onClick(() => {
                    const 名前 = this._既存名;
                    if (名前 !== null) this._配線.先.on削除(名前);
                  }),
              }])])
    );
  }

  private _保存を発火する(): void {
    const 名前 = this._名前入力.getValue().trim();
    if (名前.length === 0) {
      this.エラーを表示する("名前を入力してください");
      return;
    }
    this._配線.先.on保存({
      名前,
      種別: this._種別セレクト.getValue(),
      プロンプト: this._プロンプト入力.getValue(),
      アイコンdataUrl: this._アイコン入力.値を取得する(),
      行動パターンメモ: this._行動パターン入力.getValue(),
    });
  }
}
