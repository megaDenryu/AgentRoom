import { div, span, DivC } from "sengen-ui";
import { 送信者色を割り当てる } from "../送信者配色";
import type { メッセージDTO } from "../通信/メッセージ型";
import { 本文View } from "./本文View";
import * as styles from "./style.css";

function 時刻表示(送信時刻ISO: string): string {
  const 日時 = new Date(送信時刻ISO);
  if (Number.isNaN(日時.getTime())) return 送信時刻ISO;
  return 日時.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// タイムラインの1メッセージ（LV1拡張の行View）。構築時のデータで完結し、後から更新しない
// （メンバー種別の変化はタイムライン全体の再描画で反映される）
export class メッセージ行View extends DivC {
  constructor(メッセージ: メッセージDTO, 表示情報: { 送信者は人間か: boolean }) {
    super({ class: styles.メッセージ行 });
    this.setCssVariable("--sender-color", 送信者色を割り当てる(メッセージ.送信者)).childs([
      div({ class: styles.メッセージヘッダ }).childIfs([
        span({ text: メッセージ.送信者, class: styles.送信者ラベル }),
        {
          If: 表示情報.送信者は人間か,
          True: () => span({ text: "HUMAN", class: styles.HUMANバッジ }),
        },
        {
          If: メッセージ.宛先 !== null,
          True: () => span({ text: `→ ${メッセージ.宛先 ?? ""}`, class: styles.宛先ラベル }),
        },
        span({ text: 時刻表示(メッセージ.送信時刻), class: styles.時刻ラベル })]),
      new 本文View(メッセージ.本文)]);
  }
}
