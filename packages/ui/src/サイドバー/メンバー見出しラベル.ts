import { SpanC } from "sengen-ui";
import * as styles from "./style.css";

// メンバーパネルの見出し（LV1拡張）。選択中ルーム名を併記する
export class メンバー見出しラベル extends SpanC {
  constructor() {
    super({ class: styles.メンバー見出し });
    this.ルームを表示する(null);
  }

  ルームを表示する(ルームID: string | null): this {
    this.setTextContent(ルームID === null ? "メンバー" : `メンバー: ${ルームID}`);
    return this;
  }
}
