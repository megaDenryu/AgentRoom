import type { ロケール } from "../../文言/ロケール";
import { ロケール別文言を取得する } from "../../文言/辞書ヘルパー";
import { 英語辞書 } from "./ルーム一覧内容.en";
import { 日本語辞書 } from "./ルーム一覧内容.ja";

export function ルーム一覧内容を取得する(ロケール: ロケール) {
  return ロケール別文言を取得する(ロケール, 日本語辞書, 英語辞書);
}

export type ルーム一覧内容 = ReturnType<typeof ルーム一覧内容を取得する>;
