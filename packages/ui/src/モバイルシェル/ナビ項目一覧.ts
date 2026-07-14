import type { SvgC } from "sengen-ui";
import { ルームアイコン } from "../アイコン";

export const ルームナビ項目id = "ルーム";

export interface 下部ナビ項目定義 {
  readonly id: string;
  readonly ラベル: string;
  readonly アイコン: (size?: number, color?: string) => SvgC;
}

// 今回のスコープは会話のみのため項目は「ルーム」の1つだけ。将来、札場モバイルビュー等を
// 足すときはこの配列に項目を追加するだけで下部ナビが拡張できる構造にしている
// (ARCHITECTURE.md「下部ナビには『ルーム』だけ置き、拡張余地のある構造にする」)
export const 下部ナビ項目一覧: readonly 下部ナビ項目定義[] = [
  { id: ルームナビ項目id, ラベル: "ルーム", アイコン: ルームアイコン },
];
