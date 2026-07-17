import type { SvgC } from "sengen-ui";
import { キャラアイコン, 判定アイコン, ルームアイコン, 札場アイコン } from "../アイコン";

export const ルームナビ項目id = "ルーム";
export const 札場ナビ項目id = "札場";
export const キャラナビ項目id = "キャラ";
export const 判定ナビ項目id = "判定";

export interface 下部ナビ項目定義 {
  readonly id: string;
  readonly ラベル: string;
  readonly アイコン: (size?: number, color?: string) => SvgC;
}

// この配列に項目を追加するだけで下部ナビが拡張できる構造にしている
// (ARCHITECTURE.md「下部ナビには拡張余地のある構造にする」)。
// 「札場」はFudaba(submodules/Fudaba)のモバイル札ビューをフルスクリーンビューとして
// ホストする(デスクトップのカンバンとは別部品。ARCHITECTURE.md「デスクトップとモバイルは
// 別シェル・別ビュー」)
export const 下部ナビ項目一覧: readonly 下部ナビ項目定義[] = [
  { id: ルームナビ項目id, ラベル: "ルーム", アイコン: ルームアイコン },
  { id: 札場ナビ項目id, ラベル: "札場", アイコン: 札場アイコン },
  { id: キャラナビ項目id, ラベル: "キャラ", アイコン: キャラアイコン },
  { id: 判定ナビ項目id, ラベル: "判定", アイコン: 判定アイコン },
];
