import { div, span, DivC } from "sengen-ui";
import type { 稼働表明DTO } from "../通信/メッセージ型";
import { 相対時刻を表示する } from "../相対時刻表示";
import { 稼働状況色を返す } from "../稼働状況配色";
import type { サイドバー内容 } from "./サイドバー内容";
import * as styles from "./style.css";

// 稼働状況一覧の1行（LV1拡張の行View）。名前+状態バッジ+現在の作業+札ID+最終更新の相対時刻。
// 一覧更新のたびに作り直されるため、構築時データで完結する（メンバー項目View/ルーム項目Viewと同型）
export class 稼働状況行View extends DivC {
  constructor(表明: 稼働表明DTO, 文言: サイドバー内容) {
    super({ class: styles.稼働状況項目 });
    this.setCssVariable("--presence-status-color", 稼働状況色を返す(表明.状態)).childs([
      div({ class: styles.稼働状況名行 }).childs([
          span({ text: 表明.名前, class: styles.稼働状況名 }),
          span({ text: 表明.状態, class: styles.稼働状況バッジ })]),
      div({ class: styles.稼働状況名行 }).childIfs([
          {
            If: 表明.現在の作業 !== null,
            True: () => span({ text: 表明.現在の作業 ?? "", class: styles.作業内容テキスト }),
          },
          {
            If: 表明.札ID !== null,
            True: () => span({ text: 文言.札バッジ(表明.札ID ?? 0), class: styles.札バッジ }),
          }]),
      span({ text: 相対時刻を表示する(表明.更新時刻), class: styles.更新時刻テキスト })]);
  }
}
