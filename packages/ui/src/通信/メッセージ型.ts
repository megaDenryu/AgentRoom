export interface メッセージDTO {
  readonly 連番: number; readonly ルームID: string; readonly 送信者: string;
  readonly 本文: string; readonly 送信時刻: string; readonly 宛先: string | null;
}
export interface ルーム概要DTO {
  readonly ルームID: string; readonly メッセージ数: number; readonly 最終連番: number;
  readonly 最終送信時刻: string; readonly 未読数: number;
}
export interface メンバーDTO { readonly 名前: string; readonly 種別: string; readonly 参加時刻: string }
export interface 未読情報DTO { readonly 未読数: number; readonly 既読位置: number }
export interface 稼働表明DTO {
  readonly 名前: string; readonly 状態: "稼働中" | "待機中" | "不明";
  readonly 現在の作業: string | null; readonly 札ID: number | null; readonly 更新時刻: string;
}

export const エージェント種別一覧 = [
  "human", "claude-code", "codex", "gemini", "antigravity", "copilot", "opencode",
] as const;

export { メッセージDTOか, ルーム概要DTOか, メンバーDTOか, 未読情報DTOか, 稼働表明DTOか } from "./メッセージ型検証";
