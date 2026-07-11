import { DivC, SpanC } from "sengen-ui";
import {
  本文を解析する,
  type インライン断片,
  type 本文ブロック,
} from "../マークダウン解析";
import * as styles from "./style.css";

// メッセージ本文のMarkdown簡易レンダリング（LV1拡張）。
// 解析（マークダウン解析.ts）が判別共用体に分解し、ここでコンポーネントを組み立てる。
// 注意: innerHTML禁止。全テキストは text オプション（textContent）経由でDOMに入れること（XSS対策）

class インライン断片View extends SpanC {
  constructor(断片: インライン断片) {
    super({ text: 断片.テキスト });
    switch (断片.種別) {
      case "平文":
        break;
      case "太字":
        this.addClass(styles.太字);
        break;
      case "インラインコード":
        this.addClass(styles.インラインコード);
        break;
    }
  }
}

class 文章ブロックView extends DivC {
  constructor(インライン一覧: readonly インライン断片[]) {
    super({ class: styles.文章ブロック });
    this.childs(インライン一覧.map((断片) => new インライン断片View(断片)));
  }
}

class コードブロックView extends DivC {
  constructor(コード: string) {
    super({ text: コード, class: styles.コードブロック });
  }
}

// 本文ブロックの判別共用体を1つの子要素に組み立てる独立したクラス。
// 動的リスト生成をクラス内DOM返却メソッドにせず、独立クラスのnewに閉じる
class 本文ブロックView extends DivC {
  constructor(ブロック: 本文ブロック) {
    super();
    switch (ブロック.種別) {
      case "文章":
        this.child(new 文章ブロックView(ブロック.インライン一覧));
        break;
      case "コードブロック":
        this.child(new コードブロックView(ブロック.コード));
        break;
    }
  }
}

export class 本文View extends DivC {
  constructor(本文: string) {
    super({ class: styles.本文 });
    this.childs(本文を解析する(本文).map((ブロック) => new 本文ブロックView(ブロック)));
  }
}
