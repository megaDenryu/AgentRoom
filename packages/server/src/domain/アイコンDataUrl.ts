import { 検証エラー } from "./検証エラー.js";

const 最大文字数 = 8_000_000; // data URL文字列としてのおおよその上限（数MB級の画像を許容）

// キャラのアイコン画像を表すdata URL文字列（例: "data:image/png;base64,..."）。
// 未指定・空文字は「アイコン無し」として同じ空文字列に正規化する
export class アイコンDataUrl {
  private constructor(private readonly 内部値: string) {}

  static create(値: string | null | undefined): アイコンDataUrl {
    if (値 === null || 値 === undefined) {
      return new アイコンDataUrl("");
    }
    const 整形済み = 値.trim();
    if (整形済み.length === 0) {
      return new アイコンDataUrl("");
    }
    if (!整形済み.startsWith("data:")) {
      throw new 検証エラー('アイコンはdata URL形式（"data:"始まり）である必要があります');
    }
    if (整形済み.length > 最大文字数) {
      throw new 検証エラー(`アイコンのdata URLは${最大文字数}文字以内である必要があります`);
    }
    return new アイコンDataUrl(整形済み);
  }

  get 値(): string {
    return this.内部値;
  }
}
