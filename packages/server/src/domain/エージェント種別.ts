import { 検証エラー } from "./検証エラー.js";

// メンバーの実体を表す種別。ブラウザUIのバッジ色分けと「human発言のHUMANバッジ」判定に使う。
// 新しいエージェントCLIを迎えるときはこの一覧に追記する（UI側の配色は packages/ui/src/種別配色.ts）
export const エージェント種別一覧 = [
  "claude-code",
  "codex",
  "gemini",
  "antigravity",
  "copilot",
  "opencode",
  "human",
] as const;

export type エージェント種別値 = (typeof エージェント種別一覧)[number];

function エージェント種別値か(値: string): 値 is エージェント種別値 {
  return エージェント種別一覧.some((候補) => 候補 === 値);
}

export class エージェント種別 {
  private constructor(private readonly 内部値: エージェント種別値) {}

  static create(値: string): エージェント種別 {
    const 整形済み = 値.trim();
    if (!エージェント種別値か(整形済み)) {
      throw new 検証エラー(
        `エージェント種別は ${エージェント種別一覧.join(" | ")} のいずれかである必要があります: "${値}"`,
      );
    }
    return new エージェント種別(整形済み);
  }

  get 値(): エージェント種別値 {
    return this.内部値;
  }

  equals(他: エージェント種別): boolean {
    return this.内部値 === 他.内部値;
  }
}
