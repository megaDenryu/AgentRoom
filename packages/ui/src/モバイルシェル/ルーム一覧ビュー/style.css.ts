import { globalStyle, style } from "@vanilla-extract/css";
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

export const 項目 = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "14px 16px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  cursor: "pointer",
});

globalStyle(`${項目}:active`, { backgroundColor: AgentRoomテーマ配色.パネルホバー });

export const 項目見出し行 = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const ルーム名 = style({
  fontSize: "16px",
  fontWeight: 700,
  overflowWrap: "anywhere",
  minWidth: 0,
  flex: 1,
});

export const 未読バッジ = style({
  backgroundColor: AgentRoomテーマ配色.ネイビー,
  color: "#ffffff",
  borderRadius: "10px",
  padding: "1px 9px",
  fontSize: "12px",
  fontWeight: 700,
  flexShrink: 0,
});

globalStyle(`${未読バッジ}[data-visible="false"]`, { display: "none" });

export const メタ = style({
  fontSize: "12px",
  color: AgentRoomテーマ配色.パネルテキスト副,
});

export const 空表示 = style({
  fontSize: "14px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  textAlign: "center",
  padding: "40px 16px",
});

export const フッタリンク = style({
  flexShrink: 0,
  textAlign: "center",
  padding: "12px",
});

export const フッタリンクボタン = style({
  border: "none",
  background: "none",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  fontSize: "12px",
  textDecoration: "underline",
  cursor: "pointer",
  padding: "8px",
});
