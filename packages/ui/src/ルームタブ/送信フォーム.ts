import {
  button,
  div,
  select,
  textarea,
  textInput,
  LV2HtmlComponentBase,
  配線ポート,
  type ButtonC,
  type DivC,
  type I配線可能,
  type SelectC,
  type TextAreaC,
  type TextInputC,
} from "sengen-ui";
import { 送信者名を保存する, 送信者名を読み込む } from "../送信者名記憶";
import { エラーメッセージラベル } from "./エラーメッセージラベル";
import type { ルームタブ内容 } from "./ルームタブ内容";
import * as styles from "./style.css";

export interface 送信内容 {
  readonly 送信者: string;
  readonly 本文: string;
  // null=全員宛
  readonly 宛先: string | null;
}

export interface I送信フォーム配線 {
  on送信(内容: 送信内容): void;
}

const 全員宛の値 = "";

// メッセージ入力フォーム（LV2素部品）。入力値はDOMが真実（頻出パターン集 第4章）。
// 送信の成否反映（クリア・エラー表示・ボタン活性）は親の配線ハンドラがメソッドで流し込む
export class 送信フォーム
  extends LV2HtmlComponentBase
  implements I配線可能<I送信フォーム配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I送信フォーム配線>("送信フォーム");
  private readonly _送信者名入力: TextInputC;
  private readonly _宛先セレクト: SelectC;
  private readonly _本文入力: TextAreaC;
  private readonly _送信ボタン: ButtonC;
  private readonly _エラー表示 = new エラーメッセージラベル();

  constructor(private readonly _文言: ルームタブ内容) {
    super();
    this._送信者名入力 = textInput({
      value: 送信者名を読み込む(),
      placeholder: _文言.送信者名プレースホルダ,
      class: styles.送信者名入力,
    }).onChange(() => 送信者名を保存する(this.送信者名()));
    this._宛先セレクト = select({
      options: [{ value: 全員宛の値, text: _文言.全員宛ラベル }],
      class: styles.宛先セレクト,
    });
    this._本文入力 = textarea({
      rows: 2,
      placeholder: _文言.本文入力プレースホルダ,
      class: styles.本文入力,
    });
    this._本文入力.addTextAreaEventListener("keydown", (イベント) => {
      if (イベント.key === "Enter" && (イベント.ctrlKey || イベント.metaKey)) {
        イベント.preventDefault();
        this._送信を発火する();
      }
    });
    this._送信ボタン = button({ text: _文言.送信ボタン, class: styles.送信ボタン }).onClick(() =>
      this._送信を発火する(),
    );
    this._componentRoot = this._ルートを構築する(
      this._送信者名入力,
      this._宛先セレクト,
      this._本文入力,
      this._送信ボタン,
      this._エラー表示,
    );
  }

  配線する(配線: I送信フォーム配線): this {
    this._配線.配線する(配線);
    return this;
  }

  private _ルートを構築する(
    送信者名入力: TextInputC,
    宛先セレクト: SelectC,
    本文入力: TextAreaC,
    送信ボタン: ButtonC,
    エラー表示: エラーメッセージラベル,
  ): DivC {
    return (
      div({ class: styles.入力欄 }).childs([
          送信者名入力,
          宛先セレクト,
          本文入力,
          送信ボタン,
          エラー表示])
    );
  }

  送信者名(): string {
    return this._送信者名入力.getValue().trim();
  }

  // メンバー台帳の変化を宛先候補に反映する。選択中の宛先が残っていれば選択を維持する
  宛先候補を更新する(名前一覧: readonly string[]): void {
    const 現在値 = this._宛先セレクト.getValue();
    this._宛先セレクト.setOptions([
      { value: 全員宛の値, text: this._文言.全員宛ラベル },
      ...名前一覧.map((名前) => ({ value: 名前, text: this._文言.宛先ラベル(名前) })),
    ]);
    if (現在値 !== 全員宛の値 && 名前一覧.includes(現在値)) {
      this._宛先セレクト.setValue(現在値);
    }
  }

  送信中にする(送信中: boolean): void {
    this._送信ボタン.setDisabled(送信中);
  }

  本文をクリアする(): void {
    this._本文入力.setValue("");
    this._エラー表示.クリアする();
  }

  エラーを表示する(文言: string): void {
    this._エラー表示.表示する(文言);
  }

  private _送信を発火する(): void {
    const 送信者 = this.送信者名();
    const 本文 = this._本文入力.getValue().trim();
    if (本文.length === 0) return;
    if (送信者.length === 0) {
      this._エラー表示.表示する(this._文言.送信者名必須エラー);
      return;
    }
    const 宛先値 = this._宛先セレクト.getValue();
    this._配線.先.on送信({
      送信者,
      本文,
      宛先: 宛先値 === 全員宛の値 ? null : 宛先値,
    });
  }
}
