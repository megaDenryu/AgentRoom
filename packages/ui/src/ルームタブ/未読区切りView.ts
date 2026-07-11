import { DivC } from "sengen-ui";
import * as styles from "./style.css";

// タイムライン内の「ここから未読」区切り線（LV1拡張）
export class 未読区切りView extends DivC {
  constructor() {
    super({ text: "ここから未読", class: styles.未読区切り });
  }
}
