import { 検証エラー } from "./検証エラー.js";

function 制御文字を含むか(値: string): boolean {
  for (let 位置 = 0; 位置 < 値.length; 位置 += 1) {
    const コード = 値.charCodeAt(位置);
    if (コード <= 0x1f || コード === 0x7f) {
      return true;
    }
  }
  return false;
}

// 文書索引エントリが属するリポジトリの識別子(例: "AgentRoom" "Fudaba" "Jimbo")。
// ここでは文字列としての形式だけを検証する。「Jimbo配下のsubmoduleとして実在するか」の
// 判定は実行時設定(許可リポジトリ一覧)に依存する別の関心事のため、値オブジェクト自身の
// 不変条件には含めず文書索引ルート側に委ねる
export class 文書リポジトリ名 {
  private constructor(private readonly 内部値: string) {}

  static create(値: string): 文書リポジトリ名 {
    const 文字数 = [...値].length;
    if (文字数 < 1 || 文字数 > 64) {
      throw new 検証エラー(`文書リポジトリ名は1〜64文字である必要があります: "${値}"`);
    }
    if (値 !== 値.trim()) {
      throw new 検証エラー(`文書リポジトリ名の前後に空白は使えません: "${値}"`);
    }
    if (制御文字を含むか(値)) {
      throw new 検証エラー(`文書リポジトリ名に制御文字は使えません: "${値}"`);
    }
    if (値.includes("/") || 値.includes("\\")) {
      throw new 検証エラー(`文書リポジトリ名に"/"や"\\"は使えません: "${値}"`);
    }
    return new 文書リポジトリ名(値);
  }

  get 値(): string {
    return this.内部値;
  }
}
