import { globalStyle } from "@vanilla-extract/css";
import { AgentRoomテーマ配色, AgentRoom警告色 } from "./テーマ";

// Fudaba（札場）はホストのCSS変数（--fudaba-*）を継承する設計（Fudaba/DESIGN.md
// 「テーマ変数」章、submodules/Fudaba/packages/ui/src/テーマ.ts）。AgentRoom UIは
// これまで--fudaba-*を一切定義しておらず、Fudabaが持つフォールバック値がたまたま
// AgentRoomの富良野テーマと同じ配色だったため、現行の配色調和は偶然の一致だった。
// ここでAgentRoomテーマ配色を単一の情報源として明示的に写像することで、将来
// テーマ配色側を変えればFudabaの配色も追従する構造にする。値は現行の富良野テーマの
// 実値と同一なので、この定義追加による見た目の変化は無い。

// 「決定」バッジの緑はFudaba固有の意味色で、AgentRoomテーマ配色に対応するトークンが
// 存在しない。Fudaba側フォールバックと同値を明示することで、他の15変数と同じく
// 単一箇所（この写像表）から配色契約を追える状態にする
const Fudaba決定バッジ色 = "#2f7d5a";

globalStyle(":root", {
  vars: {
    "--fudaba-background": AgentRoomテーマ配色.ペイン背景,
    "--fudaba-surface": AgentRoomテーマ配色.パネル表面,
    "--fudaba-border": AgentRoomテーマ配色.パネル境界線,
    "--fudaba-text-primary": AgentRoomテーマ配色.パネルテキスト主,
    "--fudaba-text-secondary": AgentRoomテーマ配色.パネルテキスト副,
    "--fudaba-text-muted": AgentRoomテーマ配色.パネルテキスト薄,
    "--fudaba-hover": AgentRoomテーマ配色.パネルホバー,
    "--fudaba-accent-strong": AgentRoomテーマ配色.ネイビー,
    "--fudaba-accent": AgentRoomテーマ配色.ブルー,
    "--fudaba-danger-text": AgentRoom警告色.文字,
    "--fudaba-danger-border": AgentRoom警告色.境界,
    "--fudaba-danger-bg": AgentRoom警告色.背景弱,
    "--fudaba-kind-implementation": AgentRoomテーマ配色.ネイビー,
    "--fudaba-kind-bug": AgentRoom警告色.文字,
    "--fudaba-kind-new-spec": AgentRoomテーマ配色.ブルー,
    "--fudaba-kind-spec-review": "#9a5b16",
    "--fudaba-kind-breakdown": "#7a4e9d",
    "--fudaba-kind-record": AgentRoomテーマ配色.パネルテキスト薄,
    "--fudaba-kind-decision": Fudaba決定バッジ色,
  },
});
