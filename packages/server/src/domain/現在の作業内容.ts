import { 検証エラー } from "./検証エラー.js";

const 最大文字数 = 200;

// 稼働表明に添える自由記述の作業内容。未指定・空文字はどちらも「無し」として同じ内部値に
// 正規化する（プリミティブの空文字と「無し」を区別しないための唯一の変換点）
export class 現在の作業内容 {
  private constructor(private readonly 内部値: string | null) {}

  static create(値: string | null | undefined): 現在の作業内容 {
    if (値 === null || 値 === undefined) {
      return new 現在の作業内容(null);
    }
    const 整形済み = 値.trim();
    if (整形済み.length === 0) {
      return new 現在の作業内容(null);
    }
    if (整形済み.length > 最大文字数) {
      throw new 検証エラー(`現在の作業は${最大文字数}文字以内である必要があります`);
    }
    return new 現在の作業内容(整形済み);
  }

  get 値(): string | null {
    return this.内部値;
  }
}
