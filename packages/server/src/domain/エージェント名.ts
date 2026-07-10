import { 検証エラー } from "./検証エラー.js";

const 制御文字 = /[\u0000-\u001F\u007F]/;

export class エージェント名 {
  private constructor(private readonly 内部値: string) {}

  // AIだけでなく人間の発言者も同じ型で表す。日本語名を許容し、制御文字だけを弾く
  static create(値: string): エージェント名 {
    const 整形済み = 値.trim();
    if (整形済み.length === 0 || 整形済み.length > 64) {
      throw new 検証エラー(`エージェント名は1〜64文字である必要があります: "${値}"`);
    }
    // 改行やタブが名前に混ざるとログ・UI表示が壊れる
    if (制御文字.test(整形済み)) {
      throw new 検証エラー(`エージェント名に制御文字は使えません: "${値}"`);
    }
    return new エージェント名(整形済み);
  }

  get 値(): string {
    return this.内部値;
  }

  equals(他: エージェント名): boolean {
    return this.内部値 === 他.内部値;
  }
}
