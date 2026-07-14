// UI表示言語の値域。Fudaba札#47(AgentRoom UIのローカライズ)。
// Jimbo electron-app rendererで確立した文言辞書基盤(親札#33)と同じ構成をAgentRoom UI側に移植する。
export const ロケール一覧 = ["ja", "en"] as const;

export type ロケール = (typeof ロケール一覧)[number];

export const 既定ロケール: ロケール = "ja";

export function ロケール値か(値: string): 値 is ロケール {
  return (ロケール一覧 as readonly string[]).includes(値);
}

// ロケール表示名はロケールに関わらず自言語表記で固定する(切替前でも両方読めるようにするため)
export const ロケール表示名: Record<ロケール, string> = { ja: "日本語", en: "English" };
