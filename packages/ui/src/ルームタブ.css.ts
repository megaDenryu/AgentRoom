import { style } from "@vanilla-extract/css";
// 注意: バレル（vscode-shell-layout）経由で読むとSengenUIのDOM依存コードが
// vanilla-extractのNode実行に混入してビルドが落ちる。css.tsからはテーマモジュールを直接importする
import { 配色, フォント } from "vscode-shell-layout/テーマ/デフォルトテーマ";

// 参照: エディタエリアのコンテンツ要素には flex:1 / minWidth:0 / minHeight:0 が当たる
// （VscodeShellLayout ペイン木/style.css.ts）。はみ出し制御はこちら側の minHeight:0 で受ける
export const ルート = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  minWidth: 0,
  backgroundColor: 配色.パネル背景,
  color: 配色.パネルテキスト主,
  fontFamily: フォント.標準,
});

export const 接続バナー = style({
  padding: "6px 12px",
  fontSize: "12px",
  flexShrink: 0,
  selectors: {
    '&[data-connection="接続済み"]': { display: "none" },
    '&[data-connection="接続試行中"]': {
      backgroundColor: "#fff3cd",
      color: "#664d03",
    },
    '&[data-connection="再接続待ち"]': {
      backgroundColor: "#f8d7da",
      color: "#58151c",
    },
  },
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
  backgroundColor: "#ffffff",
  border: `1px solid ${配色.パネル境界線}`,
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

export const 時刻ラベル = style({
  fontSize: "11px",
  color: 配色.パネルテキスト薄,
});

export const 本文 = style({
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  fontSize: "14px",
  lineHeight: 1.6,
});

export const 新着ジャンプボタン = style({
  position: "absolute",
  bottom: "12px",
  left: "50%",
  transform: "translateX(-50%)",
  border: "none",
  borderRadius: "14px",
  padding: "6px 14px",
  backgroundColor: 配色.ブルー,
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "12px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  selectors: {
    '&[data-visible="false"]': { display: "none" },
  },
});

export const 入力欄 = style({
  display: "flex",
  gap: "8px",
  padding: "8px",
  borderTop: `1px solid ${配色.パネル境界線}`,
  backgroundColor: 配色.パネル表面,
  alignItems: "flex-end",
  flexWrap: "wrap",
  flexShrink: 0,
});

export const 送信者名入力 = style({
  width: "110px",
  padding: "6px 8px",
  border: `1px solid ${配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "13px",
  fontFamily: フォント.標準,
});

export const 本文入力 = style({
  flex: 1,
  minWidth: "160px",
  resize: "vertical",
  padding: "6px 8px",
  border: `1px solid ${配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: フォント.標準,
  lineHeight: 1.5,
});

export const 送信ボタン = style({
  padding: "7px 16px",
  backgroundColor: 配色.ネイビー,
  color: "#ffffff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  selectors: {
    "&:disabled": { opacity: 0.5, cursor: "default" },
  },
});

export const 送信エラー表示 = style({
  width: "100%",
  color: "#c62828",
  fontSize: "12px",
  selectors: {
    "&:empty": { display: "none" },
  },
});
