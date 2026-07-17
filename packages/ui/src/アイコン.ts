import { icon } from "sengen-ui";

// ドメイン固有アイコンはアプリ側に置く方針（VscodeShellLayoutのアイコン定義参照）。
// Lucide "message-square" 相当
export const ルームアイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  });

// Lucide "tag" 相当。札場(作業アイテム台帳)の札を表す
export const 札場アイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: [
      "M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z",
      "M7 7h.01",
    ],
  });

// Lucide "users" 相当。キャラ(人物)台帳を表す
export const キャラアイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: [
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
      "M22 21v-2a4 4 0 0 0-3-3.87",
      "M16 3.13a4 4 0 0 1 0 7.75",
    ],
  });

// Lucide "clipboard-check" 相当。人間による判断待ちの問いを表す
export const 判定アイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: [
      "M9 5h6",
      "M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2Z",
      "M9 12l2 2 4-4",
      "M7 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",
    ],
  });

// Lucide "chevron-left" 相当。モバイルシェルの画面遷移「戻る」ボタンに使う
export const 戻るアイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: ["M15 18 9 12 15 6"],
  });

// Lucide "plus" 相当。モバイルのルーム作成FAB等、新規作成の導線に使う
export const 追加アイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: ["M5 12h14", "M12 5v14"],
  });

// Lucide "globe" 相当。表示言語切替の導線に使う(Fudaba札#47)
export const 言語アイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: [
      "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
      "M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10Z",
      "M2 12h20",
    ],
  });
