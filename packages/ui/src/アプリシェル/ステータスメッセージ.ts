import { SpanC } from "sengen-ui";

// ステータスバー左に出す一時メッセージ（LV1拡張）。通知許可の状態表示などに使う
export class ステータスメッセージ extends SpanC {
  constructor() {
    super({ text: "" });
  }

  表示する(文言: string): this {
    this.setTextContent(文言);
    return this;
  }
}
