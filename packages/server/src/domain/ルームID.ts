import { 検証エラー } from "./検証エラー.js";

export class ルームID {
  private constructor(private readonly 内部値: string) {}

  // URLパス・SQLiteキー・WSトピック名として安全に使える文字だけに制限する
  static create(値: string): ルームID {
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(値)) {
      throw new 検証エラー(
        `ルームIDは英数字・ハイフン・アンダースコア1〜64文字である必要があります: "${値}"`,
      );
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
