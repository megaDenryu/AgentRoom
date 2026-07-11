import { div, span, DivC, 配線ポート, type I配線可能 } from "sengen-ui";
import type { ルーム概要DTO } from "../通信/メッセージ型";
import * as styles from "./style.css";

export interface Iルーム項目配線 {
  on選択(): void;
}

function 最終送信時刻表示(最終送信時刻ISO: string): string {
  const 日時 = new Date(最終送信時刻ISO);
  if (Number.isNaN(日時.getTime())) return 最終送信時刻ISO;
  return 日時.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ルーム一覧の1行（LV1拡張の行View）。一覧更新のたびに作り直されるため、構築時データで完結する
export class ルーム項目View extends DivC implements I配線可能<Iルーム項目配線> {
  private readonly _配線 = new 配線ポート<Iルーム項目配線>("ルーム項目View");

  constructor(概要: ルーム概要DTO) {
    super({ class: styles.ルーム項目 });
    this.onClick(() => this._配線.先.on選択()).childs([
      div({ class: styles.ルーム名行 }).childs([
          span({ text: 概要.ルームID, class: styles.ルーム名 }),
          span({ text: String(概要.未読数), class: styles.未読バッジ }).setAttributeIf({
            If: 概要.未読数 > 0,
            True: { attr: "data-visible", value: "true" },
            False: { attr: "data-visible", value: "false" },
          })]),
      div({
        text: `${概要.メッセージ数}件 / 最終 ${最終送信時刻表示(概要.最終送信時刻)}`,
        class: styles.ルームメタ,
      })]);
  }

  配線する(配線: Iルーム項目配線): this {
    this._配線.配線する(配線);
    return this;
  }
}
