import { 日本語辞書 } from "./ルームタブ内容.ja";

type 画面文言 = typeof 日本語辞書;

export const 英語辞書: 画面文言 = {
  フィルタ中案内: (相手名) => `Showing only the 1:1 conversation with "${相手名}"`,
  フィルタ解除ボタン: "Clear",
  最下部へボタン: "Jump to latest",
  新着件数表示: (件数) => `${件数} new`,
  未読区切りラベル: "Unread from here",
  送信者名プレースホルダ: "Display name",
  全員宛ラベル: "Everyone",
  宛先ラベル: (名前) => `→ ${名前}`,
  本文入力プレースホルダ: "Type a message (Ctrl+Enter to send)",
  送信ボタン: "Send",
  送信者名必須エラー: "Please enter a display name",
  送信失敗: "Failed to send the message",
  日時ロケール: "en-US",
};
