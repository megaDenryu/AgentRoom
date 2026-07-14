import { div, span, DivC } from "sengen-ui";
import { 送信者色を割り当てる } from "../../送信者配色";
import type { メッセージDTO } from "../../通信/メッセージ型";
import { 本文View } from "../../ルームタブ/本文View";
import * as styles from "./style.css";

function 時刻表示(送信時刻ISO: string): string {
  const 日時 = new Date(送信時刻ISO);
  if (Number.isNaN(日時.getTime())) return 送信時刻ISO;
  return 日時.toLocaleString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

// 会話ビューの1メッセージ行(モバイル専用のLV1拡張)。本文のMarkdownレンダリングは
// マークダウン解析.ts + 本文View(ルームタブ配下)をそのまま共有し、行の見た目だけ
// モバイル向けに新造する(HUMANバッジ・宛先表示は今回のスコープ外のため省略)
export class メッセージ行 extends DivC {
  constructor(メッセージ: メッセージDTO) {
    super({ class: styles.メッセージ行 });
    this.setCssVariable("--sender-color", 送信者色を割り当てる(メッセージ.送信者)).childs([
      div({ class: styles.メッセージヘッダ }).childs([
          span({ text: メッセージ.送信者, class: styles.送信者ラベル }),
          span({ text: 時刻表示(メッセージ.送信時刻), class: styles.時刻ラベル })]),
      new 本文View(メッセージ.本文)]);
  }
}
