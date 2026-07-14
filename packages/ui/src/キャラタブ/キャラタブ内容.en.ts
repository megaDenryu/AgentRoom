import { 日本語辞書 } from "./キャラタブ内容.ja";

type 画面文言 = typeof 日本語辞書;

export const 英語辞書: 画面文言 = {
  タイトル: "Characters",
  更新ボタン: "Refresh",
  空表示: "No characters yet",
  未申告バッジ: "Not reported",
  参加ルーム行: (ルーム名一覧) => `Rooms: ${ルーム名一覧.join(", ")}`,
  編集ボタン: "Edit",
  削除ボタン: "Delete",
  アイコンalt: "Character icon",
  フォーム見出し: "Create or edit a character",
  名前プレースホルダ: "Character name",
  プロンプトプレースホルダ: "Prompt",
  行動パターンプレースホルダ: "Behavior notes",
  保存ボタン作成: "Create",
  保存ボタン更新: "Update",
  キャンセルボタン: "Cancel",
  一覧取得失敗: "Failed to load the character list",
  保存失敗: "Failed to save the character",
  削除失敗: "Failed to delete the character",
};
