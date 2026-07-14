import {
  button,
  div,
  select,
  textInput,
  LV2HtmlComponentBase,
  配線ポート,
  type DivC,
  type I配線可能,
  type SelectC,
  type TextInputC,
} from "sengen-ui";
import { エージェント種別一覧 } from "../通信/メッセージ型";
import { 候補リストC } from "./候補リストC";
import * as styles from "./style.css";

const キャラ候補リストID = "agentroom-メンバー追加フォーム-キャラ候補";

export interface Iメンバー追加フォーム配線 {
  on追加(名前: string, 種別: string): void;
}

// 選択中ルームへのメンバー追加フォーム（LV2素部品）。名前入力はキャラ台帳からの候補選択
// (datalist)と自由入力の両方を許す。名前+種別セレクト+追加ボタン
export class メンバー追加フォーム
  extends LV2HtmlComponentBase
  implements I配線可能<Iメンバー追加フォーム配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iメンバー追加フォーム配線>("メンバー追加フォーム");
  private readonly _名前入力: TextInputC;
  private readonly _種別セレクト: SelectC;
  private readonly _キャラ候補 = new 候補リストC(キャラ候補リストID);

  constructor() {
    super();
    this._名前入力 = textInput({
      placeholder: "メンバー名",
      class: styles.フォーム入力,
    })
      .setAttribute("list", キャラ候補リストID)
      .onEnterKey(() => this._追加を発火する());
    this._種別セレクト = select({
      options: エージェント種別一覧.map((種別) => ({ value: 種別, text: 種別 })),
      class: styles.フォームセレクト,
    });
    this._componentRoot = this._ルートを構築する(
      this._名前入力,
      this._キャラ候補,
      this._種別セレクト,
    );
  }

  配線する(配線: Iメンバー追加フォーム配線): this {
    this._配線.配線する(配線);
    return this;
  }

  private _ルートを構築する(
    名前入力: TextInputC,
    キャラ候補: 候補リストC,
    種別セレクト: SelectC,
  ): DivC {
    return (
      div({ class: styles.フォーム行 }).childs([
          名前入力,
          キャラ候補,
          種別セレクト,
          button({ text: "追加", class: styles.フォームボタン }).onClick(() =>
            this._追加を発火する(),
          )])
    );
  }

  クリアする(): void {
    this._名前入力.setValue("");
  }

  キャラ候補を更新する(名前一覧: readonly string[]): void {
    this._キャラ候補.候補を設定する(名前一覧);
  }

  private _追加を発火する(): void {
    const 名前 = this._名前入力.getValue().trim();
    if (名前.length === 0) return;
    this._配線.先.on追加(名前, this._種別セレクト.getValue());
  }
}
