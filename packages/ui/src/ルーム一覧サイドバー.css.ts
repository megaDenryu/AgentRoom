import { style } from "@vanilla-extract/css";
// 注意: バレル（vscode-shell-layout）経由で読むとSengenUIのDOM依存コードが
// vanilla-extractのNode実行に混入してビルドが落ちる。css.tsからはテーマモジュールを直接importする
import { 配色, フォント } from "vscode-shell-layout/テーマ/デフォルトテーマ";

export const ルート = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  color: 配色.パネルテキスト主,
  fontFamily: フォント.標準,
});

export const ヘッダ = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  borderBottom: `1px solid ${配色.パネル境界線}`,
  flexShrink: 0,
});

export const タイトル = style({
  fontSize: "13px",
  fontWeight: 600,
});

export const 更新ボタン = style({
  border: `1px solid ${配色.パネル境界線}`,
  borderRadius: "4px",
  backgroundColor: "#ffffff",
  color: 配色.パネルテキスト主,
  padding: "3px 10px",
  fontSize: "12px",
  cursor: "pointer",
  selectors: {
    "&:hover": { backgroundColor: 配色.パネルホバー },
  },
});

export const 状態表示 = style({
  fontSize: "11px",
  color: 配色.パネルテキスト薄,
  padding: "4px 12px",
  flexShrink: 0,
  selectors: {
    "&:empty": { display: "none" },
  },
});

export const 一覧領域 = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

export const ルーム項目 = style({
  padding: "8px 12px",
  cursor: "pointer",
  borderBottom: `1px solid ${配色.パネル境界線}`,
  selectors: {
    "&:hover": { backgroundColor: 配色.パネルホバー },
  },
});

export const ルーム名 = style({
  fontSize: "13px",
  fontWeight: 600,
  overflowWrap: "anywhere",
});

export const ルームメタ = style({
  fontSize: "11px",
  color: 配色.パネルテキスト副,
  marginTop: "2px",
});

export const 空表示 = style({
  fontSize: "12px",
  color: 配色.パネルテキスト薄,
  textAlign: "center",
  padding: "20px 12px",
});
