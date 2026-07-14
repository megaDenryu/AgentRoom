import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { AgentRoomテーマ配色, AgentRoom警告色 } from "../テーマ";
import { シート表示状態, ナビ選択状態, 画面表示状態 } from "./状態";

const 開花 = keyframes({
  "0%": { transform: "translateX(-50%) scale(0)", opacity: 0 },
  "60%": { transform: "translateX(-50%) scale(1.4)", opacity: 1 },
  "100%": { transform: "translateX(-50%) scale(1)", opacity: 1 },
});

export const ルート = style({
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  backgroundColor: AgentRoomテーマ配色.アプリ背景,
  color: AgentRoomテーマ配色.テキスト主,
  fontFamily: AgentRoomテーマ配色.基本フォントファミリ,
  fontWeight: AgentRoomテーマ配色.基本文字ウェイト,
});

// 単一フルスクリーンビュー領域。ルーム一覧・会話スロットの2枚をここに重ねて置き、
// data-attributeの切替だけで表示画面を差し替える(頻出パターン集第6章パターンA)
export const 画面レイヤー = style({
  position: "relative",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
});

// signature: 画面遷移は方向性のあるスライドではなく「持ち上がって現れる」ふわっとした
// クロスフェードにした。富良野テーマの淡さに合わせ、主張しすぎない一度きりの演出に絞る
export const 画面 = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  transition: "opacity 180ms ease, transform 180ms ease",
});

globalStyle(`${画面}[${画面表示状態.attribute}="${画面表示状態.value.表示}"]`, {
  opacity: 1,
  transform: "translateY(0) scale(1)",
  pointerEvents: "auto",
});
globalStyle(`${画面}[${画面表示状態.attribute}="${画面表示状態.value.非表示}"]`, {
  opacity: 0,
  transform: "translateY(6px) scale(0.99)",
  pointerEvents: "none",
});

export const 下部ナビ = style({
  display: "flex",
  flexShrink: 0,
  borderTop: `1px solid ${AgentRoomテーマ配色.パネル境界線}`,
  backgroundColor: AgentRoomテーマ配色.クローム背景,
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
});

export const ナビ項目 = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  minHeight: "56px",
  border: "none",
  background: "none",
  color: AgentRoomテーマ配色.ネイビー,
  cursor: "pointer",
});

globalStyle(`${ナビ項目}[${ナビ選択状態.attribute}="${ナビ選択状態.value.選択}"]`, {
  color: AgentRoomテーマ配色.ブルー,
});

export const ナビアイコン枠 = style({
  position: "relative",
  display: "flex",
});

// signature: 富良野=ラベンダー畑を踏まえた「開花」インジケータ。アイコン下の小さな点が
// タブが選択されるたびに咲く。他の演出は足さず、ここ一箇所に主張を集約する。
// 非選択時はdisplay:noneにしておくことで、再選択のたびdisplayの復帰でアニメーションが
// 再生される(CSSはdisplay:none→復帰でkeyframeアニメーションを再始動する)
export const ナビ開花点 = style({
  position: "absolute",
  bottom: "-6px",
  left: "50%",
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  backgroundColor: AgentRoomテーマ配色.ブルー,
  transform: "translateX(-50%) scale(0)",
  display: "none",
});

globalStyle(
  `${ナビ項目}[${ナビ選択状態.attribute}="${ナビ選択状態.value.選択}"] ${ナビ開花点}`,
  {
    display: "block",
    animation: `${開花} 320ms 120ms ease-out forwards`,
  },
);

export const ナビラベル = style({
  fontSize: "11px",
  fontWeight: 600,
});

// ボトムシート: 背景オーバーレイ+下端固定のシート。頻出パターン集第5章の
// data-attribute+transitionパターンに従う
export const オーバーレイ = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(58, 51, 85, 0.35)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  transition: "opacity 200ms ease",
  zIndex: 50,
});

globalStyle(`${オーバーレイ}[${シート表示状態.attribute}="${シート表示状態.value.表示}"]`, {
  opacity: 1,
  pointerEvents: "auto",
});
globalStyle(`${オーバーレイ}[${シート表示状態.attribute}="${シート表示状態.value.非表示}"]`, {
  opacity: 0,
  pointerEvents: "none",
});

export const シート = style({
  width: "100%",
  maxWidth: "480px",
  backgroundColor: AgentRoomテーマ配色.パネル表面,
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  padding: "8px 16px calc(20px + env(safe-area-inset-bottom, 0px))",
  boxShadow: "0 -4px 20px rgba(58, 51, 85, 0.18)",
  transition: "transform 220ms ease",
});

globalStyle(`${オーバーレイ}[${シート表示状態.attribute}="${シート表示状態.value.表示}"] ${シート}`, {
  transform: "translateY(0)",
});
globalStyle(`${オーバーレイ}[${シート表示状態.attribute}="${シート表示状態.value.非表示}"] ${シート}`, {
  transform: "translateY(100%)",
});

export const シートつまみ = style({
  width: "36px",
  height: "4px",
  borderRadius: "2px",
  backgroundColor: AgentRoomテーマ配色.パネル境界線,
  margin: "8px auto 12px",
});

// ルーム一覧ビュー・会話ビュー共通のエラー/状態表示行(エラー表示ラベル.ts)
export const エラー表示 = style({
  display: "block",
  fontSize: "12px",
  color: AgentRoom警告色.文字,
  padding: "4px 16px",
  flexShrink: 0,
  ":empty": { display: "none" },
});
