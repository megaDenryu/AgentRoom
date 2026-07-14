import { globalStyle, style } from "@vanilla-extract/css";
import { フォント } from "vscode-shell-layout/テーマ/デフォルトテーマ";
import {
  AgentRoomアクセント上文字色,
  AgentRoomコードブロック配色,
  AgentRoomテーマ配色,
} from "../../テーマ";

// 参照: このルートは会話スロット(画面表示状態の画面.ts, display:flex)の直接の子として
// 差し込まれる。flex:1+minHeight:0で残り高さいっぱいに広がらないと、メッセージ一覧より
// 下に空白が残ってしまう(ヘッダ・接続バナー・送信バーはflexShrink:0で高さを確保する側)
export const ルート = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  minWidth: 0,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
});

export const ヘッダ = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 8px",
  borderBottom: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  backgroundColor: AgentRoomテーマ配色.クローム背景,
  flexShrink: 0,
});

export const 戻るボタン = style({
  border: "none",
  background: "none",
  color: AgentRoomテーマ配色.クロームテキスト,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  flexShrink: 0,
  cursor: "pointer",
});

export const タイトル = style({
  fontSize: "16px",
  fontWeight: 700,
  overflowWrap: "anywhere",
  minWidth: 0,
});

export const 接続バナー = style({
  padding: "6px 16px",
  fontSize: "12px",
  flexShrink: 0,
});

globalStyle(`${接続バナー}[data-connection="接続済み"]`, { display: "none" });
globalStyle(`${接続バナー}[data-connection="接続試行中"]`, {
  backgroundColor: "#fff3cd",
  color: "#664d03",
});
globalStyle(`${接続バナー}[data-connection="再接続待ち"]`, {
  backgroundColor: "#f8d7da",
  color: "#58151c",
});

export const 枠 = style({
  position: "relative",
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
});

export const リスト = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const メッセージ行 = style({
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderLeftWidth: "4px",
  borderLeftColor: "var(--sender-color, #888888)",
  borderRadius: "10px",
  padding: "10px 12px",
  flexShrink: 0,
});

export const メッセージヘッダ = style({
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  marginBottom: "4px",
});

export const 送信者ラベル = style({
  backgroundColor: "var(--sender-color, #555555)",
  color: "#ffffff",
  borderRadius: "4px",
  padding: "2px 8px",
  fontSize: "13px",
  fontWeight: 700,
});

export const 時刻ラベル = style({
  fontSize: "11px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
});

export const 本文 = style({
  fontSize: "15px",
  lineHeight: 1.6,
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const 文章ブロック = style({
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
});

export const 太字 = style({ fontWeight: 700 });

export const インラインコード = style({
  fontFamily: フォント.モノ,
  fontSize: "0.9em",
  backgroundColor: AgentRoomテーマ配色.パネルホバー,
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "3px",
  padding: "0 4px",
});

export const コードブロック = style({
  fontFamily: フォント.モノ,
  fontSize: "13px",
  lineHeight: 1.5,
  whiteSpace: "pre",
  overflowX: "auto",
  backgroundColor: AgentRoomコードブロック配色.背景,
  color: AgentRoomコードブロック配色.文字,
  borderRadius: "6px",
  padding: "10px 12px",
});

export const 新着ジャンプボタン = style({
  position: "absolute",
  bottom: "12px",
  left: "50%",
  transform: "translateX(-50%)",
  border: "none",
  borderRadius: "16px",
  padding: "8px 16px",
  backgroundColor: AgentRoomテーマ配色.ブルー,
  color: AgentRoomアクセント上文字色,
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(58, 51, 85, 0.20)",
});

globalStyle(`${新着ジャンプボタン}[data-visible="false"]`, { display: "none" });

// 送信バー: 本文入力は16px未満だとiOS Safariが自動ズームするため、意図的に16pxを維持する
export const 送信バー = style({
  display: "flex",
  alignItems: "flex-end",
  gap: "8px",
  padding: "8px 8px calc(8px + env(safe-area-inset-bottom, 0px))",
  borderTop: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  flexShrink: 0,
});

export const 設定ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "10px",
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.テキスト副,
  fontSize: "12px",
  fontWeight: 600,
  padding: "0 10px",
  height: "44px",
  flexShrink: 0,
  cursor: "pointer",
});

export const 本文入力 = style({
  flex: 1,
  minWidth: 0,
  resize: "none",
  maxHeight: "120px",
  padding: "11px 12px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "10px",
  fontSize: "16px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  lineHeight: 1.4,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
});

export const 送信ボタン = style({
  border: "none",
  borderRadius: "10px",
  backgroundColor: AgentRoomテーマ配色.ネイビー,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  padding: "0 18px",
  height: "44px",
  flexShrink: 0,
  cursor: "pointer",
  ":disabled": { opacity: 0.5, cursor: "default" },
});

export const 設定シート見出し = style({
  fontSize: "15px",
  fontWeight: 700,
  display: "block",
  marginBottom: "10px",
});

export const 設定ラベル = style({
  fontSize: "12px",
  color: AgentRoomテーマ配色.パネルテキスト副,
  display: "block",
  marginBottom: "6px",
});

export const 設定入力 = style({
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
