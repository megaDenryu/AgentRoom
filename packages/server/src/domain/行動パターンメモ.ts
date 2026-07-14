import { 検証エラー } from "./検証エラー.js";

const 最大文字数 = 4000;

// キャラの行動傾向についての自由記述メモ。プロンプトとは別に、担当割り当て時の
// 参考情報として人間が読む用途を想定する。未指定は空文字列に正規化する
export class 行動パターンメモ {
  private constructor(private readonly 内部値: string) {}

  static create(値: string | null | undefined): 行動パターンメモ {
    if (値 === null || 値 === undefined) {
      return new 行動パターンメモ("");
    }
    if (値.length > 最大文字数) {
      throw new 検証エラー(`行動パターンメモは${最大文字数}文字以内である必要があります`);
    }
    return new 行動パターンメモ(値);
  }

  get 値(): string {
    return this.内部値;
  }
}
