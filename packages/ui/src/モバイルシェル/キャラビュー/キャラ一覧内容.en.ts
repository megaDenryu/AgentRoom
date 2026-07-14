import { 日本語辞書 } from "./キャラ一覧内容.ja";

type 画面文言 = typeof 日本語辞書;

export const 英語辞書: 画面文言 = {
  タイトル: "Characters",
  更新ボタン: "Refresh",
  空表示見出し: "No characters yet",
  空表示キャプション: "Tap the + button to add a new character",
  未申告バッジ: "Not reported",
  参加ルーム行: (ルーム名一覧) => `Rooms: ${ルーム名一覧.join(", ")}`,
  アイコンalt: "Character icon",
  シート見出し作成: "Create a character",
  シート見出し編集: "Edit character",
  名前プレースホルダ: "Character name",
  プロンプトプレースホルダ: "Prompt",
  行動パターンプレースホルダ: "Behavior notes",
  保存ボタン作成: "Create",
  保存ボタン更新: "Update",
  削除ボタン: "Delete",
  名前必須エラー: "Please enter a name",
  一覧取得失敗: "Failed to load the character list",
  保存失敗: "Failed to save the character",
  削除失敗: "Failed to delete the character",
};
