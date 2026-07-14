import { span, textInput, DivC, type TextInputC } from "sengen-ui";
import { 送信者名を保存する, 送信者名を読み込む } from "../../送信者名記憶";
import * as styles from "./style.css";

// ボトムシートに差し込む「送信設定」の内容(モバイル専用のLV1拡張)。送信者名は
// 入力のたびにlocalStorageへ即保存し、送信バーは送信時にそこから読み直す
// (送信者名記憶.ts参照)。宛先の個別指定は今回のスコープ外
export class 送信設定シート内容 extends DivC {
  private readonly _送信者名入力: TextInputC;

  constructor() {
    super();
    this._送信者名入力 = textInput({
      value: 送信者名を読み込む(),
      class: styles.設定入力,
    }).onChange(() => 送信者名を保存する(this._送信者名入力.getValue().trim()));
    this.childs([
      span({ text: "送信設定", class: styles.設定シート見出し }),
      span({ text: "送信者名", class: styles.設定ラベル }),
      this._送信者名入力]);
  }
}
