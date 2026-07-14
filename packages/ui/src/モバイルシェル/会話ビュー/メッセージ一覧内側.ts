import { DivC } from "sengen-ui";
import type { メッセージ行 } from "./メッセージ行";
import * as styles from "./style.css";

// 最下部からこの距離以内なら「最下部にいる」とみなして自動追従を続ける
const 最下部判定しきい値px = 48;

// スクロールするメッセージ一覧の中身(モバイル専用のLV1拡張)。
// スクロール位置の読み取りはSengenUIにAPIが無いため、自クラス内のelement参照に留める
export class メッセージ一覧内側 extends DivC {
  constructor() {
    super({ class: styles.リスト });
  }

  追記する(行: メッセージ行): this {
    this.child(行);
    return this;
  }

  最下部付近にいるか(): boolean {
    const 要素 = this.dom.element;
    return 要素.scrollHeight - 要素.scrollTop - 要素.clientHeight < 最下部判定しきい値px;
  }

  最下部へスクロールする(): void {
    const 要素 = this.dom.element;
    要素.scrollTop = 要素.scrollHeight;
  }
}
