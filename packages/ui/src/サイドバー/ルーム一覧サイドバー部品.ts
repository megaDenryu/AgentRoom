import type { Relayクライアント } from "../通信/Relayクライアント";
import { メンバー追加フォーム } from "./メンバー追加フォーム";
import { 新規ルームフォーム } from "./新規ルームフォーム";
import { 稼働状況パネル } from "./稼働状況パネル";

// ルーム一覧サイドバーが集約する部品の型契約（部品DTO）。構築はstaticファクトリに閉じる
export class ルーム一覧サイドバー部品 {
  private constructor(
    readonly 新規ルームフォーム: 新規ルームフォーム,
    readonly メンバー追加フォーム: メンバー追加フォーム,
    readonly 稼働状況パネル: 稼働状況パネル,
  ) {}

  static 作る(クライアント: Relayクライアント): ルーム一覧サイドバー部品 {
    return new ルーム一覧サイドバー部品(
      new 新規ルームフォーム(),
      new メンバー追加フォーム(),
      new 稼働状況パネル(クライアント),
    );
  }
}
