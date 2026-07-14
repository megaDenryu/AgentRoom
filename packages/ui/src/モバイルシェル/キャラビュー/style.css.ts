import { style } from "@vanilla-extract/css";
import { AgentRoomテーマ配色 } from "../../テーマ";

export const ルート = style({
  backgroundColor: AgentRoomテーマ配色.パネル背景,
});

export const ヘッダ = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 16px 12px",
  flexShrink: 0,
});

export const タイトル = style({
  fontSize: "20px",
  fontWeight: 700,
});

export const 更新ボタン = style({
  border: "none",
  background: "none",
  color: AgentRoomテーマ配色.ブルー,
  fontSize: "14px",
  fontWeight: 600,
  padding: "10px 6px",
  cursor: "pointer",
});

export const リスト = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

export const 空表示 = style({
  fontSize: "14px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  textAlign: "center",
  padding: "40px 16px",
});

export const 項目 = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  cursor: "pointer",
});

export const 項目アイコン = style({
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
  backgroundColor: AgentRoomテーマ配色.アクティブ背景,
});

export const 項目本文 = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  minWidth: 0,
  flex: 1,
});

export const 項目見出し行 = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const 項目名 = style({
  fontSize: "16px",
  fontWeight: 700,
  overflowWrap: "anywhere",
  minWidth: 0,
});

export const 種別バッジ = style({
  backgroundColor: "var(--chara-type-color, #546e7a)",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "1px 9px",
  fontSize: "11px",
  fontWeight: 700,
  flexShrink: 0,
});

export const 稼働バッジ = style({
  backgroundColor: "var(--chara-presence-color, #546e7a)",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "1px 9px",
  fontSize: "11px",
  fontWeight: 700,
  flexShrink: 0,
});

export const 未申告バッジ = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  color: AgentRoomテーマ配色.パネルテキスト薄,
  borderRadius: "10px",
  padding: "1px 9px",
  fontSize: "11px",
  flexShrink: 0,
});

export const 行動メモ = style({
  fontSize: "12px",
  color: AgentRoomテーマ配色.パネルテキスト副,
  overflowWrap: "anywhere",
});

// キャラ作成の導線(FAB)。ルーム一覧ビューの新規作成FABと同じ配置規約
export const 新規作成FAB = style({
  position: "absolute",
  right: "16px",
  bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: AgentRoomテーマ配色.ブルー,
  color: "#ffffff",
  boxShadow: "0 4px 12px rgba(58, 51, 85, 0.30)",
  cursor: "pointer",
});

export const シート見出し = style({
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "4px",
});

export const シート本体 = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  maxHeight: "70vh",
  overflowY: "auto",
});

export const 入力 = style({
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "10px",
  fontSize: "16px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
  ":disabled": { opacity: 0.6 },
});

export const セレクト = style({
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "10px",
  fontSize: "16px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
});

export const テキストエリア = style({
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "10px",
  fontSize: "15px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
  resize: "vertical",
});

export const アイコン入力 = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

export const アイコンプレビュー = style({
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  objectFit: "cover",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  backgroundColor: AgentRoomテーマ配色.アクティブ背景,
  flexShrink: 0,
});

export const ファイル選択 = style({
  fontSize: "12px",
  color: AgentRoomテーマ配色.パネルテキスト副,
  minWidth: 0,
});

export const ボタン行 = style({
  display: "flex",
  gap: "8px",
  marginTop: "4px",
});

export const 保存ボタン = style({
  flex: 1,
  border: "none",
  borderRadius: "10px",
  backgroundColor: AgentRoomテーマ配色.ネイビー,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  padding: "0 18px",
  height: "44px",
  cursor: "pointer",
  ":disabled": { opacity: 0.5, cursor: "default" },
});

export const 削除ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "10px",
  backgroundColor: "transparent",
  color: "#c9403a",
  fontSize: "14px",
  fontWeight: 700,
  padding: "0 16px",
  height: "44px",
  cursor: "pointer",
});
