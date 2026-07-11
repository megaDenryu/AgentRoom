import { メンバー追加フォーム } from "./メンバー追加フォーム";
import { 新規ルームフォーム } from "./新規ルームフォーム";

// ルーム一覧サイドバーが集約する部品の型契約（部品DTO）。構築はstaticファクトリに閉じる
export class ルーム一覧サイドバー部品 {
  private constructor(
    readonly 新規ルームフォーム: 新規ルームフォーム,
    readonly メンバー追加フォーム: メンバー追加フォーム,
  ) {}

  static 作る(): ルーム一覧サイドバー部品 {
    return new ルーム一覧サイドバー部品(new 新規ルームフォーム(), new メンバー追加フォーム());
  }
}
