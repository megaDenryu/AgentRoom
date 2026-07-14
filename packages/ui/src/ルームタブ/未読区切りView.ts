import { DivC } from "sengen-ui";
import type { ルームタブ内容 } from "./ルームタブ内容";
import * as styles from "./style.css";

// タイムライン内の「ここから未読」区切り線（LV1拡張）
export class 未読区切りView extends DivC {
  constructor(文言: ルームタブ内容) {
    super({ text: 文言.未読区切りラベル, class: styles.未読区切り });
  }
}
