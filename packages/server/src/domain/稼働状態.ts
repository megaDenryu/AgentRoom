import { 検証エラー } from "./検証エラー.js";

// エージェント（人間も含む）が自己申告する稼働状態。サーバーが強制する「不明」状態は
// この型に含めない（表示稼働状態値.ts が申告値+TTL経過を合成した表示用の型を持つ）
export const 稼働状態一覧 = ["稼働中", "待機中"] as const;

export type 稼働状態値 = (typeof 稼働状態一覧)[number];

function 稼働状態値か(値: string): 値 is 稼働状態値 {
  return 稼働状態一覧.some((候補) => 候補 === 値);
}

export class 稼働状態 {
  private constructor(private readonly 内部値: 稼働状態値) {}

  static create(値: string): 稼働状態 {
    if (!稼働状態値か(値)) {
      throw new 検証エラー(
        `稼働状態は ${稼働状態一覧.join(" | ")} のいずれかである必要があります: "${値}"`,
      );
    }
    return new 稼働状態(値);
  }

  get 値(): 稼働状態値 {
    return this.内部値;
  }
}
