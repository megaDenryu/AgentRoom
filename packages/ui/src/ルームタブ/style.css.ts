import { globalStyle, style } from "@vanilla-extract/css";
// 注意: バレル（vscode-shell-layout）経由で読むとSengenUIのDOM依存コードが
// vanilla-extractのNode実行に混入してビルドが落ちる。css.tsからはテーマモジュールを直接importする
import { フォント } from "vscode-shell-layout/テーマ/デフォルトテーマ";
import {
  AgentRoomアクセント上文字色,
  AgentRoomコードブロック配色,
  AgentRoomテーマ配色,
  AgentRoom警告色,
} from "../テーマ";

// 参照: エディタエリアのコンテンツ要素には flex:1 / minWidth:0 / minHeight:0 が当たる
// （VscodeShellLayout ペイン木/style.css.ts）。はみ出し制御はこちら側の minHeight:0 で受ける
export const ルート = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  minWidth: 0,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
});

export const 接続バナー = style({
  padding: "6px 12px",
  fontSize: "12px",
  flexShrink: 0,
});

// data-attributeセレクタは selectors だとコンパイル未検出の実行時エラーになるため globalStyle を使う
globalStyle(`${接続バナー}[data-connection="接続済み"]`, { display: "none" });
globalStyle(`${接続バナー}[data-connection="接続試行中"]`, {
  backgroundColor: "#fff3cd",
  color: "#664d03",
});
globalStyle(`${接続バナー}[data-connection="再接続待ち"]`, {
  backgroundColor: "#f8d7da",
  color: "#58151c",
});

export const フィルタバナー = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 12px",
  fontSize: "12px",
  flexShrink: 0,
  backgroundColor: "#e3f2fd",
  color: "#0d47a1",
});

globalStyle(`${フィルタバナー}[data-visible="false"]`, { display: "none" });

export const フィルタ解除ボタン = style({
  border: `1px solid ${AgentRoomテーマ配色.ブルー}`,
  borderRadius: "4px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  color: AgentRoomテーマ配色.ブルー,
  padding: "2px 10px",
  fontSize: "11px",
  cursor: "pointer",
});

export const タイムライン枠 = style({
  position: "relative",
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
});

export const タイムライン = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const メッセージ行 = style({
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderLeftWidth: "4px",
  borderLeftColor: "var(--sender-color, #888888)",
  borderRadius: "4px",
  padding: "8px 10px",
  flexShrink: 0,
});

export const メッセージヘッダ = style({
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "4px",
});

export const 送信者ラベル = style({
  backgroundColor: "var(--sender-color, #555555)",
  color: "#ffffff",
  borderRadius: "3px",
  padding: "1px 8px",
  fontSize: "12px",
  fontWeight: 600,
});

export const HUMANバッジ = style({
  border: "1px solid #2e7d32",
  color: "#2e7d32",
  borderRadius: "3px",
  padding: "0 6px",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.5px",
});

export const 宛先ラベル = style({
  fontSize: "12px",
  fontWeight: 600,
  color: AgentRoomテーマ配色.ブルー,
});

export const 時刻ラベル = style({
  fontSize: "11px",
  color: AgentRoomテーマ配色.パネルテキスト薄,
});

export const 本文 = style({
  fontSize: "14px",
  lineHeight: 1.6,
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const 文章ブロック = style({
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
});

export const 太字 = style({
  fontWeight: 700,
});

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
  fontSize: "12px",
  lineHeight: 1.5,
  whiteSpace: "pre",
  overflowX: "auto",
  backgroundColor: AgentRoomコードブロック配色.背景,
  color: AgentRoomコードブロック配色.文字,
  borderRadius: "4px",
  padding: "8px 10px",
});

export const 未読区切り = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: AgentRoom警告色.文字,
  fontSize: "11px",
  fontWeight: 600,
  flexShrink: 0,
  "::before": {
    content: '""',
    flex: 1,
    borderTop: `1px solid ${AgentRoom警告色.境界}`,
  },
  "::after": {
    content: '""',
    flex: 1,
    borderTop: `1px solid ${AgentRoom警告色.境界}`,
  },
});

export const 新着ジャンプボタン = style({
  position: "absolute",
  bottom: "12px",
  left: "50%",
  transform: "translateX(-50%)",
  border: "none",
  borderRadius: "14px",
  padding: "6px 14px",
  backgroundColor: AgentRoomテーマ配色.ブルー,
  color: AgentRoomアクセント上文字色,
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
  // 淡いライトテーマ上では濃い影が浮くため、旧ダークテーマ比で薄めの影にする
  boxShadow: "0 2px 6px rgba(58, 51, 85, 0.18)",
});

globalStyle(`${新着ジャンプボタン}[data-visible="false"]`, { display: "none" });

export const 入力欄 = style({
  display: "flex",
  gap: "8px",
  padding: "8px",
  borderTop: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  alignItems: "flex-end",
  flexWrap: "wrap",
  flexShrink: 0,
});

export const 送信者名入力 = style({
  width: "110px",
  padding: "6px 8px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "13px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
});

export const 宛先セレクト = style({
  padding: "6px 8px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "13px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
  maxWidth: "140px",
});

export const 本文入力 = style({
  flex: 1,
  minWidth: "160px",
  resize: "vertical",
  padding: "6px 8px",
  border: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
  lineHeight: 1.5,
  backgroundColor: AgentRoomテーマ配色.パネル背景,
  color: AgentRoomテーマ配色.パネルテキスト主,
});

export const 送信ボタン = style({
  padding: "7px 16px",
  backgroundColor: AgentRoomテーマ配色.ネイビー,
  color: "#ffffff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  ":disabled": { opacity: 0.5, cursor: "default" },
});

export const 送信エラー表示 = style({
  width: "100%",
  color: AgentRoom警告色.文字,
  fontSize: "12px",
  ":empty": { display: "none" },
});
