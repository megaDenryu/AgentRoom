import { 日本語辞書 } from "./サイドバー内容.ja";

type 画面文言 = typeof 日本語辞書;

export const 英語辞書: 画面文言 = {
  タイトル: "Rooms",
  更新ボタン: "Refresh",
  通知有効化ボタン: "Enable notifications",
  表示切替ボタン: "Switch to mobile view",
  ルーム空表示: "No rooms yet",
  新規ルーム名プレースホルダ: "New room name",
  新規ルーム作成ボタン: "Create",
  ルーム項目メタ: (メッセージ数, 最終表示) => `${メッセージ数} messages / last ${最終表示}`,
  日時ロケール: "en-US",
  メンバー見出し未選択: "Members",
  メンバー見出し選択中: (ルームID) => `Members: ${ルームID}`,
  メンバー空表示: "No members",
  メンバー未選択案内: "Select a room to see its members",
  メンバー名プレースホルダ: "Member name",
  メンバー追加ボタン: "Add",
  メンバー削除ボタン: "Remove",
  稼働状況見出し: "Presence",
  稼働状況空表示: "No presence reports yet",
  札バッジ: (札ID) => `Card #${札ID}`,
  一覧取得失敗: "Failed to load the room list",
  作成失敗: "Failed to create the room",
  メンバー追加失敗: "Failed to add the member",
  メンバー削除失敗: "Failed to remove the member",
  ルーム未選択エラー: "Please select a room first",
  稼働状況取得失敗: "Failed to load the presence list",
};
