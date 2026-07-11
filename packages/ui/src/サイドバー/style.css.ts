import { globalStyle, style } from "@vanilla-extract/css";
// 注意: バレル（vscode-shell-layout）経由で読むとSengenUIのDOM依存コードが
// vanilla-extractのNode実行に混入してビルドが落ちる。css.tsからはテーマモジュールを直接importする
import { 配色, フォント } from "vscode-shell-layout/テーマ/デフォルトテーマ";

// ルーム一覧（上段）とメンバー一覧（下段）の2段構成
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
  ":hover": { backgroundColor: 配色.パネルホバー },
});

export const フォーム行 = style({
  display: "flex",
  gap: "6px",
  padding: "8px 12px",
  borderBottom: `1px solid ${配色.パネル境界線}`,
  flexShrink: 0,
});

export const フォーム入力 = style({
  flex: 1,
  minWidth: 0,
  padding: "4px 8px",
  border: `1px solid ${配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: フォント.標準,
});

export const フォームセレクト = style({
  padding: "4px 6px",
  border: `1px solid ${配色.パネル境界線}`,
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: フォント.標準,
  backgroundColor: "#ffffff",
  maxWidth: "110px",
});

export const フォームボタン = style({
  border: "none",
  borderRadius: "4px",
  backgroundColor: 配色.ネイビー,
  color: "#ffffff",
  padding: "4px 10px",
  fontSize: "12px",
  cursor: "pointer",
  flexShrink: 0,
  ":disabled": { opacity: 0.5, cursor: "default" },
});

export const 状態表示 = style({
  fontSize: "11px",
  color: "#c62828",
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
  borderBottom: `1px solid ${配色.パネル境界線}`,
  ":hover": { backgroundColor: 配色.パネルホバー },
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
  color: 配色.パネルテキスト副,
  marginTop: "2px",
});

export const 空表示 = style({
  fontSize: "12px",
  color: 配色.パネルテキスト薄,
  textAlign: "center",
  padding: "20px 12px",
});

export const メンバーヘッダ = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  borderTop: `2px solid ${配色.パネル境界線}`,
  borderBottom: `1px solid ${配色.パネル境界線}`,
  flexShrink: 0,
  backgroundColor: 配色.パネル表面,
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
  borderBottom: `1px solid ${配色.パネル境界線}`,
  ":hover": { backgroundColor: 配色.パネルホバー },
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
  border: `1px solid ${配色.パネル境界線}`,
  borderRadius: "3px",
  backgroundColor: "#ffffff",
  color: "#c62828",
  padding: "1px 6px",
  fontSize: "10px",
  cursor: "pointer",
  flexShrink: 0,
  ":hover": { backgroundColor: "#fdecea" },
});

export const 通知ボタン = style({
  margin: "8px 12px",
  border: `1px solid ${配色.パネル境界線}`,
  borderRadius: "4px",
  backgroundColor: "#ffffff",
  color: 配色.パネルテキスト主,
  padding: "5px 10px",
  fontSize: "12px",
  cursor: "pointer",
  flexShrink: 0,
  ":hover": { backgroundColor: 配色.パネルホバー },
});
