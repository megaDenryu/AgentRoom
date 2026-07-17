import type { Relayクライアント } from "../通信/Relayクライアント";
import { メンバー追加フォーム } from "./メンバー追加フォーム";
import { 新規ルームフォーム } from "./新規ルームフォーム";
import type { サイドバー内容 } from "./サイドバー内容";
import { 稼働状況パネル } from "./稼働状況パネル";
import { ルーム一覧領域 } from "./ルーム一覧領域";
import { メンバー一覧領域 } from "./メンバー一覧領域";
import { メンバー見出しラベル } from "./メンバー見出しラベル";
import { 状態表示ラベル } from "./状態表示ラベル";
import { 通知状態ラベル } from "./通知状態ラベル";
import { 言語選択 } from "./言語選択";

// ルーム一覧サイドバーが集約する部品の型契約（部品DTO）。構築はstaticファクトリに閉じる
export class ルーム一覧サイドバー部品 {
  private constructor(
    readonly 新規ルームフォーム: 新規ルームフォーム,
    readonly メンバー追加フォーム: メンバー追加フォーム,
    readonly 稼働状況パネル: 稼働状況パネル,
    readonly ルーム一覧: ルーム一覧領域,
    readonly メンバー一覧: メンバー一覧領域,
    readonly メンバー見出し: メンバー見出しラベル,
    readonly 状態表示: 状態表示ラベル,
    readonly 通知状態: 通知状態ラベル,
    readonly 言語選択: 言語選択,
  ) {}

  static 作る(クライアント: Relayクライアント, 文言: サイドバー内容): ルーム一覧サイドバー部品 {
    return new ルーム一覧サイドバー部品(
      new 新規ルームフォーム(文言),
      new メンバー追加フォーム(文言),
      new 稼働状況パネル(クライアント),
      new ルーム一覧領域(文言), new メンバー一覧領域(文言), new メンバー見出しラベル(文言),
      new 状態表示ラベル(), new 通知状態ラベル(), new 言語選択(),
    );
  }
}
