import { style } from "@vanilla-extract/css";
import { AgentRoomテーマ配色, AgentRoom警告色 } from "../テーマ";

export const ルート = style({
  display: "flex",
  height: "100%",
  color: AgentRoomテーマ配色.テキスト主,
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
});

export const 一覧側 = style({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  borderRight: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
});

export const ヘッダ = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  flexShrink: 0,
});

export const タイトル = style({
  fontSize: "15px",
  fontWeight: 700,
});

export const 更新ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  padding: "4px 12px",
  fontSize: "12px",
  cursor: "pointer",
  ":hover": { backgroundColor: AgentRoomテーマ配色.パネルホバー },
});

export const 状態表示 = style({
  fontSize: "12px",
  color: AgentRoom警告色.文字,
  padding: "4px 16px",
  flexShrink: 0,
  ":empty": { display: "none" },
});

export const 一覧領域 = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

export const 空表示 = style({
  fontSize: "13px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  textAlign: "center",
  padding: "32px 16px",
});

export const 項目 = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 16px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
});

export const 項目アイコン = style({
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
  backgroundColor: AgentRoomテーマ配色.アクティブ背景,
});

export const 項目本文 = style({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  minWidth: 0,
  flex: 1,
});

export const 項目名行 = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const 項目名 = style({
  fontSize: "13px",
  fontWeight: 600,
  overflowWrap: "anywhere",
  minWidth: 0,
});

export const 種別バッジ = style({
  backgroundColor: "var(--chara-type-color, #546e7a)",
  color: "#ffffff",
  borderRadius: "3px",
  padding: "1px 6px",
  fontSize: "10px",
  fontWeight: 600,
  flexShrink: 0,
});

export const 稼働バッジ = style({
  backgroundColor: "var(--chara-presence-color, #546e7a)",
  color: "#ffffff",
  borderRadius: "3px",
  padding: "1px 6px",
  fontSize: "10px",
  fontWeight: 600,
  flexShrink: 0,
});

export const 未申告バッジ = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  color: AgentRoomテーマ配色.パネルテキスト薄,
  borderRadius: "3px",
  padding: "1px 6px",
  fontSize: "10px",
  flexShrink: 0,
});

export const 行動メモ = style({
  fontSize: "11px",
  color: AgentRoomテーマ配色.パネルテキスト副,
  overflowWrap: "anywhere",
});

export const 項目ボタン列 = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flexShrink: 0,
});

export const 編集ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "3px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  padding: "2px 8px",
  fontSize: "11px",
  cursor: "pointer",
  ":hover": { backgroundColor: AgentRoomテーマ配色.パネルホバー },
});

export const 削除ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "3px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoom警告色.文字,
  padding: "2px 8px",
  fontSize: "11px",
  cursor: "pointer",
  ":hover": { backgroundColor: AgentRoom警告色.背景弱 },
});

export const フォーム側 = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "300px",
  flexShrink: 0,
  padding: "16px",
  overflowY: "auto",
});

export const 見出し = style({
  fontSize: "14px",
  fontWeight: 700,
});

export const 入力 = style({
  width: "100%",
  boxSizing: "border-box",
  padding: "6px 8px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  ":disabled": { opacity: 0.6 },
});

export const セレクト = style({
  width: "100%",
  boxSizing: "border-box",
  padding: "6px 8px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
});

export const テキストエリア = style({
  width: "100%",
  boxSizing: "border-box",
  padding: "6px 8px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  resize: "vertical",
});

export const 保存ボタン = style({
  border: "none",
  borderRadius: "4px",
  backgroundColor: AgentRoomテーマ配色.ネイビー,
  color: "#ffffff",
  padding: "7px 10px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  ":hover": { opacity: 0.9 },
});

export const キャンセルボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  padding: "6px 10px",
  fontSize: "12px",
  cursor: "pointer",
  ":hover": { backgroundColor: AgentRoomテーマ配色.パネルホバー },
});

export const アイコン入力 = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

export const アイコンプレビュー = style({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  objectFit: "cover",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  backgroundColor: AgentRoomテーマ配色.アクティブ背景,
  flexShrink: 0,
});

export const ファイル選択 = style({
  fontSize: "11px",
  color: AgentRoomテーマ配色.パネルテキスト副,
  minWidth: 0,
});
