import { 日本語辞書 } from "./ルーム一覧内容.ja";

type 画面文言 = typeof 日本語辞書;

export const 英語辞書: 画面文言 = {
  タイトル: "Rooms",
  更新ボタン: "Refresh",
  PC版で開くボタン: "Open desktop view",
  空表示見出し: "No rooms yet",
  空表示キャプション: "Tap the + button to create a new room",
  新規ルーム見出し: "Create a new room",
  新規ルーム名プレースホルダ: "New room name",
  新規ルーム作成ボタン: "Create",
  項目メタ: (メッセージ数, 最終表示) => `${メッセージ数} messages / last ${最終表示}`,
  日時ロケール: "en-US",
  一覧取得失敗: "Failed to load the room list",
  作成失敗: "Failed to create the room",
};
