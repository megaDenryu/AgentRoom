import { 検証エラー } from "./検証エラー.js";

const 最大文字数 = 20000;

// キャラが名乗られたときに従うべき事前プロンプト（人格・口調・役割の定義）。
// 未指定は空文字列に正規化する（プロンプト無しのキャラも許容するため）
export class キャラプロンプト {
  private constructor(private readonly 内部値: string) {}

  static create(値: string | null | undefined): キャラプロンプト {
    if (値 === null || 値 === undefined) {
      return new キャラプロンプト("");
    }
    if (値.length > 最大文字数) {
      throw new 検証エラー(`プロンプトは${最大文字数}文字以内である必要があります`);
    }
    return new キャラプロンプト(値);
  }

  get 値(): string {
    return this.内部値;
  }
}
