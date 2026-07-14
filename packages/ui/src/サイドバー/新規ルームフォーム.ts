import {
  button,
  div,
  textInput,
  LV2HtmlComponentBase,
  配線ポート,
  type DivC,
  type I配線可能,
  type TextInputC,
} from "sengen-ui";
import type { サイドバー内容 } from "./サイドバー内容";
import * as styles from "./style.css";

export interface I新規ルームフォーム配線 {
  on作成(ルームID: string): void;
}

// ルーム作成フォーム（LV2素部品）。「作成」= 自分をそのルームにメンバー登録すること
// なので、実際の登録処理は配線先（サイドバー）が担う
export class 新規ルームフォーム
  extends LV2HtmlComponentBase
  implements I配線可能<I新規ルームフォーム配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I新規ルームフォーム配線>("新規ルームフォーム");
  private readonly _入力: TextInputC;

  constructor(文言: サイドバー内容) {
    super();
    this._入力 = textInput({
      placeholder: 文言.新規ルーム名プレースホルダ,
      class: styles.フォーム入力,
    }).onEnterKey(() => this._作成を発火する());
    this._componentRoot = this._ルートを構築する(this._入力, 文言);
  }

  配線する(配線: I新規ルームフォーム配線): this {
    this._配線.配線する(配線);
    return this;
  }

  private _ルートを構築する(入力: TextInputC, 文言: サイドバー内容): DivC {
    return (
      div({ class: styles.フォーム行 }).childs([
          入力,
          button({ text: 文言.新規ルーム作成ボタン, class: styles.フォームボタン }).onClick(() =>
            this._作成を発火する(),
          )])
    );
  }

  クリアする(): void {
    this._入力.setValue("");
  }

  private _作成を発火する(): void {
    const ルームID = this._入力.getValue().trim();
    if (ルームID.length === 0) return;
    this._配線.先.on作成(ルームID);
  }
}
