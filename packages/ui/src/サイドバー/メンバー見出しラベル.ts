import { SpanC } from "sengen-ui";
import type { サイドバー内容 } from "./サイドバー内容";
import * as styles from "./style.css";

// メンバーパネルの見出し（LV1拡張）。選択中ルーム名を併記する
export class メンバー見出しラベル extends SpanC {
  constructor(private readonly _文言: サイドバー内容) {
    super({ class: styles.メンバー見出し });
    this.ルームを表示する(null);
  }

  ルームを表示する(ルームID: string | null): this {
    this.setTextContent(
      ルームID === null
        ? this._文言.メンバー見出し未選択
        : this._文言.メンバー見出し選択中(ルームID),
    );
    return this;
  }
}
