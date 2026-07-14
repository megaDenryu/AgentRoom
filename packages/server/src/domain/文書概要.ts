import { 検証エラー } from "./検証エラー.js";

const 最大文字数 = 2000;

// 文書索引エントリの概要。未指定・空文字はどちらも「無し」として同じ内部値(null)に
// 正規化する(現在の作業内容.tsと同じ変換点)
export class 文書概要 {
  private constructor(private readonly 内部値: string | null) {}

  static create(値: string | null | undefined): 文書概要 {
    if (値 === null || 値 === undefined) {
      return new 文書概要(null);
    }
    const 整形済み = 値.trim();
    if (整形済み.length === 0) {
      return new 文書概要(null);
    }
    if ([...整形済み].length > 最大文字数) {
      throw new 検証エラー(`文書概要は${最大文字数}文字以内である必要があります`);
    }
    return new 文書概要(整形済み);
  }

  get 値(): string | null {
    return this.内部値;
  }
}
