import { エラー表示ラベル } from "../エラー表示ラベル";
import type { 会話内容 } from "./会話内容";
import { 接続バナー } from "./接続バナー";
import { メッセージ一覧 } from "./メッセージ一覧";
import { 送信バー } from "./送信バー";

// 会話ビューが集約する部品の型契約(部品DTO)。構築はstaticファクトリに閉じる
export class 会話ビュー部品 {
  private constructor(
    readonly 接続バナー: 接続バナー,
    readonly メッセージ一覧: メッセージ一覧,
    readonly 送信バー: 送信バー,
    readonly エラー表示: エラー表示ラベル,
  ) {}

  static 作る(文言: 会話内容): 会話ビュー部品 {
    return new 会話ビュー部品(
      new 接続バナー(文言),
      new メッセージ一覧(文言),
      new 送信バー(文言),
      new エラー表示ラベル(),
    );
  }
}
