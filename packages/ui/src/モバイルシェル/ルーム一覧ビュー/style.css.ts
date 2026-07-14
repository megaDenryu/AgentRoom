import { globalStyle, style } from "@vanilla-extract/css";
import { AgentRoomテーマ配色 } from "../../テーマ";

export const ルート = style({
  backgroundColor: AgentRoomテーマ配色.パネル背景,
});

// ヘッダは会話ビューのヘッダ(クローム背景+下境界線)とトーンを揃え、シェル全体で
// 「同じ画面の一部」に見えるようにする(旧来はパネル背景と同化して境界が曖昧だった)
export const ヘッダ = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
  flexShrink: 0,
  backgroundColor: AgentRoomテーマ配色.クローム背景,
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
});

export const タイトル = style({
  fontSize: "20px",
  fontWeight: 700,
});

// テキストリンクだった旧デザインから、タップ領域が明確なチップボタンへ格上げ
export const 更新ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "8px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.ブルー,
  fontSize: "13px",
  fontWeight: 600,
  padding: "7px 12px",
  cursor: "pointer",
  transition: "background-color 120ms ease",
});

globalStyle(`${更新ボタン}:active`, { backgroundColor: AgentRoomテーマ配色.ホバー背景 });

// 右下FABの上に最終カードが隠れないよう、下端に余白を確保する
export const リスト = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "14px 16px calc(96px + env(safe-area-inset-bottom, 0px))",
});

// 行を区切り線で連結する旧デザインから、1件ずつ独立したカードへ変更(会話ビューの
// メッセージ行と同じ質感=白地・境界線・淡い影に揃え、シェル全体でトーンを統一する)
export const 項目 = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "14px 16px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "14px",
  boxShadow: "0 1px 3px rgba(58, 51, 85, 0.08)",
  cursor: "pointer",
  transition: "transform 120ms ease, box-shadow 120ms ease",
});

globalStyle(`${項目}:active`, {
  transform: "scale(0.98)",
  boxShadow: "0 1px 2px rgba(58, 51, 85, 0.06)",
});

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

// 空状態は「文字だけの一行」から、アイコン+見出し+次の行動を促すキャプションの
// 3段構成へ拡張する。何もない画面を放置せず、次に何をすればよいかを示す
export const 空表示 = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  padding: "56px 24px",
  textAlign: "center",
});

export const 空表示アイコン枠 = style({
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: AgentRoomテーマ配色.アクティブ背景,
  color: AgentRoomテーマ配色.ブルー,
});

export const 空表示見出し = style({
  fontSize: "15px",
  fontWeight: 700,
  color: AgentRoomテーマ配色.パネルテキスト副,
});

export const 空表示キャプション = style({
  fontSize: "12px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
  lineHeight: 1.5,
});

export const フッタリンク = style({
  flexShrink: 0,
  textAlign: "center",
  padding: "10px 12px",
  borderTop: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
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

// ルーム作成の導線(FAB)。リスト領域と同じ`画面`要素(position:absolute)を
// 基準に右下へ絶対配置する。下部ナビの上に浮くよう十分な余白を確保する
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

export const 新規ルームシート = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const 新規ルーム見出し = style({
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "4px",
});

export const 新規ルーム入力 = style({
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

export const 新規ルーム作成ボタン = style({
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
