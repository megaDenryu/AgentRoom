// キャラ種別バッジの配色。色は補助であり、種別名テキストを常に併記する(種別配色.ts と同じ方針)。
// サーバーの許可値(server/src/domain/キャラ種別.ts)は「人間」「AI」の2種のみ
const キャラ種別配色表: Readonly<Record<string, string>> = {
  人間: "#2e7d32",
  AI: "#1a73e8",
};

const 既定色 = "#546e7a";

export function キャラ種別色を返す(種別: string): string {
  return キャラ種別配色表[種別] ?? 既定色;
}
