import { DivC } from "sengen-ui";
import type { 接続状態 } from "../../通信/ルーム接続";
import * as styles from "./style.css";

// WS接続状態のバナー(モバイル専用のLV1拡張)。data-connection属性で配色を切り替える
export class 接続バナー extends DivC {
  constructor() {
    super({ class: styles.接続バナー });
    this.setAttribute("data-connection", "接続試行中");
  }

  状態を反映する(状態: 接続状態): this {
    this.setAttribute("data-connection", 状態.種別);
    switch (状態.種別) {
      case "接続済み":
        break;
      case "接続試行中":
        this.setTextContent("サーバーに接続しています...");
        break;
      case "再接続待ち":
        this.setTextContent(
          `切断されました。${Math.round(状態.待機ミリ秒 / 1000)}秒後に再接続します`,
        );
        break;
    }
    return this;
  }
}
