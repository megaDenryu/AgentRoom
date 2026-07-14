import type { ロケール } from "../文言/ロケール";
import { ロケール別文言を取得する } from "../文言/辞書ヘルパー";
import { 英語辞書 } from "./ルームタブ内容.en";
import { 日本語辞書 } from "./ルームタブ内容.ja";

export function ルームタブ内容を取得する(ロケール: ロケール) {
  return ロケール別文言を取得する(ロケール, 日本語辞書, 英語辞書);
}

export type ルームタブ内容 = ReturnType<typeof ルームタブ内容を取得する>;
