import { 検証エラー } from "./検証エラー.js";

// キャラ(人物)の実体区分。人間が自ら人物として登録される場合と、AIエージェントが
// 名乗る人物の場合を区別する。エージェント種別（claude-code等の実行系識別）とは
// 別軸の概念なので値オブジェクトも分ける
export const キャラ種別一覧 = ["人間", "AI"] as const;

export type キャラ種別値 = (typeof キャラ種別一覧)[number];

function キャラ種別値か(値: string): 値 is キャラ種別値 {
  return キャラ種別一覧.some((候補) => 候補 === 値);
}

export class キャラ種別 {
  private constructor(private readonly 内部値: キャラ種別値) {}

  static create(値: string): キャラ種別 {
    const 整形済み = 値.trim();
    if (!キャラ種別値か(整形済み)) {
      throw new 検証エラー(
        `キャラ種別は ${キャラ種別一覧.join(" | ")} のいずれかである必要があります: "${値}"`,
      );
    }
    return new キャラ種別(整形済み);
  }

  get 値(): キャラ種別値 {
    return this.内部値;
  }

  equals(他: キャラ種別): boolean {
    return this.内部値 === 他.内部値;
  }
}
