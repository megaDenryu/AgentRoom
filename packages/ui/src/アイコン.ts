import { icon } from "sengen-ui";

// ドメイン固有アイコンはアプリ側に置く方針（VscodeShellLayoutのアイコン定義参照）。
// Lucide "message-square" 相当
export const ルームアイコン = (size = 20, color = "currentColor") =>
  icon({
    size,
    color,
    paths: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  });
