import { 検証エラー } from "./検証エラー.js";

const 最大文字数 = 500;

function 制御文字を含むか(値: string): boolean {
  for (let 位置 = 0; 位置 < 値.length; 位置 += 1) {
    const コード = 値.charCodeAt(位置);
    if (コード <= 0x1f || コード === 0x7f) {
      return true;
    }
  }
  return false;
}

// 文書索引エントリのリポジトリ内相対パス。第3歩(markdownビューア)でホストの
// ファイルシステムから読み取る対象になる想定のため、ここでパストラバーサルの芽を摘む
// (絶対パス・".."セグメントを拒否する)。参照: Jimbo/ARCHITECTURE.md「Phase C設計」案2
export class 文書パス {
  private constructor(private readonly 内部値: string) {}

  static create(値: string): 文書パス {
    if (値 !== 値.trim()) {
      throw new 検証エラー(`文書パスの前後に空白は使えません: "${値}"`);
    }
    const 文字数 = [...値].length;
    if (文字数 < 1 || 文字数 > 最大文字数) {
      throw new 検証エラー(`文書パスは1〜${最大文字数}文字である必要があります: "${値}"`);
    }
    if (制御文字を含むか(値)) {
      throw new 検証エラー(`文書パスに制御文字は使えません: "${値}"`);
    }
    if (値.startsWith("/") || 値.startsWith("\\") || /^[A-Za-z]:/.test(値)) {
      throw new 検証エラー(
        `文書パスは絶対パスにできません(リポジトリルートからの相対パスのみ受け付ける): "${値}"`,
      );
    }
    const セグメント一覧 = 値.split(/[\\/]/);
    if (セグメント一覧.some((セグメント) => セグメント === "..")) {
      throw new 検証エラー(`文書パスに".."は使えません(パストラバーサル防止): "${値}"`);
    }
    return new 文書パス(値);
  }

  get 値(): string {
    return this.内部値;
  }
}
