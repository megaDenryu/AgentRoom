import { 検証エラー } from "./検証エラー.js";

const 最大文字数 = 300;

function 制御文字を含むか(値: string): boolean {
  for (let 位置 = 0; 位置 < 値.length; 位置 += 1) {
    const コード = 値.charCodeAt(位置);
    if (コード <= 0x1f || コード === 0x7f) {
      return true;
    }
  }
  return false;
}

// 文書索引エントリの見出し。一覧表示で文書を識別する主要な手がかりのため必須項目とする
export class 文書タイトル {
  private constructor(private readonly 内部値: string) {}

  static create(値: string): 文書タイトル {
    const 整形済み = 値.trim();
    if (整形済み.length === 0) {
      throw new 検証エラー("文書タイトルは空にできません");
    }
    if ([...整形済み].length > 最大文字数) {
      throw new 検証エラー(`文書タイトルは${最大文字数}文字以内である必要があります`);
    }
    if (制御文字を含むか(整形済み)) {
      throw new 検証エラー(`文書タイトルに制御文字は使えません: "${値}"`);
    }
    return new 文書タイトル(整形済み);
  }

  get 値(): string {
    return this.内部値;
  }
}
