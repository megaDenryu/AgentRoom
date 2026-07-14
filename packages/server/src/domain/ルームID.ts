import { 検証エラー } from "./検証エラー.js";

// 改行やタブが混ざるとログ・UI表示が壊れるため、制御文字（コードポイント0x1F以下、0x7F）を弾く。
// メンバー名.ts(Fudaba)と同じ判定方針（正規表現のUnicodeエスケープは文字化けを誘発しやすいため文字コード比較）
function 制御文字を含むか(値: string): boolean {
  for (let 位置 = 0; 位置 < 値.length; 位置 += 1) {
    const コード = 値.charCodeAt(位置);
    if (コード <= 0x1f || コード === 0x7f) {
      return true;
    }
  }
  return false;
}

export class ルームID {
  private constructor(private readonly 内部値: string) {}

  // 日本語を含む任意のUnicode文字列を許容する。URLはpercent-encoding、SQLiteのTEXTキーは
  // 日本語対応であり文字種を制限する技術的必然はない。"/""\"だけはURLパス区切りとして
  // 実務上禁止する（infra層でのパス組み立てに使われるため）
  static create(値: string): ルームID {
    const 文字数 = [...値].length;
    if (文字数 < 1 || 文字数 > 64) {
      throw new 検証エラー(`ルームIDは1〜64文字である必要があります: "${値}"`);
    }
    if (値 !== 値.trim()) {
      throw new 検証エラー(`ルームIDの前後に空白は使えません: "${値}"`);
    }
    if (制御文字を含むか(値)) {
      throw new 検証エラー(`ルームIDに制御文字は使えません: "${値}"`);
    }
    if (値.includes("/") || 値.includes("\\")) {
      throw new 検証エラー(`ルームIDに"/"や"\\"は使えません: "${値}"`);
    }
    return new ルームID(値);
  }

  get 値(): string {
    return this.内部値;
  }

  equals(他: ルームID): boolean {
    return this.内部値 === 他.内部値;
  }
}
