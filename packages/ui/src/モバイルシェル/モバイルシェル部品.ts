import { div, type DivC } from "sengen-ui";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { ルーム一覧ビュー } from "./ルーム一覧ビュー/ルーム一覧ビュー";
import { ボトムシート } from "./ボトムシート";
import { 下部ナビ } from "./下部ナビ";
import * as styles from "./style.css";
import { 画面表示状態 } from "./状態";

// モバイルシェルが集約する部品の型契約(部品DTO)。会話ビューはルーム選択のたびに
// 生成・破棄されるためここには含めず、会話スロット(空のdiv)だけを持たせ、
// モバイルシェルサービスが都度中身を差し込む(頻出パターン集第6章パターンB)
export class モバイルシェル部品 {
  private constructor(
    readonly ルーム一覧ビュー: ルーム一覧ビュー,
    readonly 会話スロット: DivC,
    readonly 下部ナビ: 下部ナビ,
    readonly ボトムシート: ボトムシート,
  ) {}

  static 作る(クライアント: Relayクライアント): モバイルシェル部品 {
    return new モバイルシェル部品(
      new ルーム一覧ビュー(クライアント),
      div({ class: styles.画面 }).setAttribute(
        画面表示状態.attribute,
        画面表示状態.value.非表示,
      ),
      new 下部ナビ(),
      new ボトムシート(),
    );
  }
}
