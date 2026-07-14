import { globalStyle, style } from "@vanilla-extract/css";
import { 狭幅メディアクエリ } from "../レスポンシブ";
import { AgentRoomテーマ配色, AgentRoom警告色 } from "../テーマ";

// ルーム一覧（上段）とメンバー一覧（下段）の2段構成
export const ルート = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  color: AgentRoomテーマ配色.パネルテキスト主,
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
});

export const ヘッダ = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  flexShrink: 0,
});

export const タイトル = style({
  fontSize: "13px",
  fontWeight: 600,
});

export const 更新ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  padding: "3px 10px",
  fontSize: "12px",
  cursor: "pointer",
  ":hover": { backgroundColor: AgentRoomテーマ配色.パネルホバー },
  "@media": {
    [狭幅メディアクエリ]: { minHeight: "44px", padding: "10px 14px", fontSize: "13px" },
  },
});

export const フォーム行 = style({
  display: "flex",
  gap: "6px",
  padding: "8px 12px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  flexShrink: 0,
});

export const フォーム入力 = style({
  flex: 1,
  minWidth: 0,
  padding: "4px 8px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
});

export const フォームセレクト = style({
  padding: "4px 6px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  maxWidth: "110px",
});

export const フォームボタン = style({
  border: "none",
  borderRadius: "4px",
  backgroundColor: AgentRoomテーマ配色.ネイビー,
  color: "#ffffff",
  padding: "4px 10px",
  fontSize: "12px",
  cursor: "pointer",
  flexShrink: 0,
  ":disabled": { opacity: 0.5, cursor: "default" },
  "@media": {
    [狭幅メディアクエリ]: { minHeight: "44px", padding: "10px 14px", fontSize: "13px" },
  },
});

export const 状態表示 = style({
  fontSize: "11px",
  color: AgentRoom警告色.文字,
  padding: "4px 12px",
  flexShrink: 0,
  ":empty": { display: "none" },
});

export const 一覧領域 = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

export const ルーム項目 = style({
  padding: "8px 12px",
  cursor: "pointer",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  ":hover": { backgroundColor: AgentRoomテーマ配色.パネルホバー },
  "@media": {
    [狭幅メディアクエリ]: { minHeight: "44px", display: "flex", flexDirection: "column", justifyContent: "center" },
  },
});

export const ルーム名行 = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const ルーム名 = style({
  fontSize: "13px",
  fontWeight: 600,
  overflowWrap: "anywhere",
  minWidth: 0,
  flex: 1,
});

export const 未読バッジ = style({
  backgroundColor: "#c62828",
  color: "#ffffff",
  borderRadius: "9px",
  padding: "0 7px",
  fontSize: "11px",
  fontWeight: 700,
  lineHeight: "18px",
  flexShrink: 0,
});

// data-attributeセレクタは selectors だとコンパイル未検出の実行時エラーになるため globalStyle を使う
globalStyle(`${未読バッジ}[data-visible="false"]`, { display: "none" });

export const ルームメタ = style({
  fontSize: "11px",
  color: AgentRoomテーマ配色.パネルテキスト副,
  marginTop: "2px",
});

export const 空表示 = style({
  fontSize: "12px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  textAlign: "center",
  padding: "20px 12px",
});

export const メンバーヘッダ = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  borderTop: `2px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  flexShrink: 0,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
});

export const メンバー見出し = style({
  fontSize: "12px",
  fontWeight: 600,
  overflowWrap: "anywhere",
});

export const メンバー一覧領域 = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

export const メンバー項目 = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  cursor: "pointer",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  ":hover": { backgroundColor: AgentRoomテーマ配色.パネルホバー },
  "@media": {
    [狭幅メディアクエリ]: { minHeight: "44px", padding: "10px 12px" },
  },
});

export const メンバー名 = style({
  fontSize: "12px",
  fontWeight: 600,
  overflowWrap: "anywhere",
  minWidth: 0,
  flex: 1,
});

export const 種別バッジ = style({
  backgroundColor: "var(--member-type-color, #546e7a)",
  color: "#ffffff",
  borderRadius: "3px",
  padding: "1px 6px",
  fontSize: "10px",
  fontWeight: 600,
  flexShrink: 0,
});

export const メンバー削除ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "3px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoom警告色.文字,
  padding: "1px 6px",
  fontSize: "10px",
  cursor: "pointer",
  flexShrink: 0,
  ":hover": { backgroundColor: AgentRoom警告色.背景弱 },
});

export const 通知ボタン = style({
  margin: "8px 12px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.パネルテキスト主,
  padding: "5px 10px",
  fontSize: "12px",
  cursor: "pointer",
  flexShrink: 0,
  ":hover": { backgroundColor: AgentRoomテーマ配色.パネルホバー },
  "@media": {
    [狭幅メディアクエリ]: { minHeight: "44px", padding: "10px 14px", fontSize: "13px" },
  },
});

// 通知許可状態の小さな状態表示（ステータスバー廃止に伴い、サイドバー下部に移設）
export const 通知状態 = style({
  fontSize: "11px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  padding: "0 12px 8px",
  flexShrink: 0,
  ":empty": { display: "none" },
});

export const 稼働状況ルート = style({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  maxHeight: "220px",
});

export const 稼働状況一覧領域 = style({
  overflowY: "auto",
});

export const 稼働状況項目 = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  padding: "6px 12px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
});

export const 稼働状況名行 = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const 稼働状況名 = style({
  fontSize: "12px",
  fontWeight: 600,
  overflowWrap: "anywhere",
  minWidth: 0,
});

export const 稼働状況バッジ = style({
  backgroundColor: "var(--presence-status-color, #546e7a)",
  color: "#ffffff",
  borderRadius: "3px",
  padding: "1px 6px",
  fontSize: "10px",
  fontWeight: 600,
  flexShrink: 0,
});

export const 作業内容テキスト = style({
  fontSize: "11px",
  color: AgentRoomテーマ配色.パネルテキスト副,
  overflowWrap: "anywhere",
  minWidth: 0,
});

export const 札バッジ = style({
  fontSize: "10px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "3px",
  padding: "0 5px",
  flexShrink: 0,
});

export const 更新時刻テキスト = style({
  fontSize: "10px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
});

// モバイルシェルへの手動切替リンク（狭幅ブラウザでデスクトップ表示を選んでいる場合の脱出口）
export const 表示切替ボタン = style({
  border: "none",
  background: "none",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  fontSize: "11px",
  textDecoration: "underline",
  cursor: "pointer",
  padding: "0 12px 10px",
  textAlign: "left",
  flexShrink: 0,
});
