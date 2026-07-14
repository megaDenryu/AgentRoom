import { 日本語辞書 } from "./会話内容.ja";

type 画面文言 = typeof 日本語辞書;

export const 英語辞書: 画面文言 = {
  接続試行中: "Connecting to the server...",
  再接続待ち: (待機秒) => `Disconnected. Reconnecting in ${待機秒}s`,
  本文入力プレースホルダ: "Type a message",
  送信ボタン: "Send",
  設定ボタン: "Settings",
  設定シート見出し: "Send settings",
  送信者名ラベル: "Display name",
  最下部へボタン: "Jump to latest",
  新着件数表示: (件数) => `${件数} new`,
  送信失敗: "Failed to send the message",
};
