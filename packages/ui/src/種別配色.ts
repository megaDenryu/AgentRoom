// メンバー種別バッジの配色。色は補助であり、種別名テキストを常に併記する（色覚特性への配慮）。
// サーバーの許可値（domain/エージェント種別.ts）に無い文字列が来た場合も落とさず既定色で表示する
const 種別配色表: Readonly<Record<string, string>> = {
  human: "#2e7d32",
  "claude-code": "#c15f3c",
  codex: "#0d9488",
  gemini: "#1a73e8",
  antigravity: "#7c3aed",
  copilot: "#57606a",
  opencode: "#b45309",
};

const 既定色 = "#546e7a";

export function 種別色を返す(種別: string): string {
  return 種別配色表[種別] ?? 既定色;
}
