import { DivC } from "sengen-ui";
import type { メッセージ行View } from "./メッセージ行View";
import type { 未読区切りView } from "./未読区切りView";
import * as styles from "./style.css";

// 最下部からこの距離以内なら「最下部にいる」とみなして自動追従を続ける
const 最下部判定しきい値px = 48;

export type タイムライン項目 = メッセージ行View | 未読区切りView;

// スクロールするメッセージ一覧のコンテナ（LV1拡張）
export class メッセージ一覧領域 extends DivC {
  constructor() {
    super({ class: styles.タイムライン });
  }

  全件を差し替える(項目一覧: readonly タイムライン項目[]): this {
    this.clearChildren().childs(項目一覧);
    return this;
  }

  追記する(項目一覧: readonly タイムライン項目[]): this {
    this.childs(項目一覧);
    return this;
  }

  // スクロール位置の読み取りはSengenUIにAPIが無いため、自クラス内のelement参照に留める
  最下部付近にいるか(): boolean {
    const 要素 = this.dom.element;
    return 要素.scrollHeight - 要素.scrollTop - 要素.clientHeight < 最下部判定しきい値px;
  }
}
