import type { ロケール } from "../文言/ロケール";
import { ロケール別文言を取得する } from "../文言/辞書ヘルパー";
import { 英語辞書 } from "./サイドバー内容.en";
import { 日本語辞書 } from "./サイドバー内容.ja";

export function サイドバー内容を取得する(ロケール: ロケール) {
  return ロケール別文言を取得する(ロケール, 日本語辞書, 英語辞書);
}

export type サイドバー内容 = ReturnType<typeof サイドバー内容を取得する>;
