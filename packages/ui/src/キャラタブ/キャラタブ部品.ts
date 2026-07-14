import { キャラ一覧領域 } from "./キャラ一覧領域";
import type { キャラタブ内容 } from "./キャラタブ内容";
import { キャラフォーム } from "./キャラフォーム";
import { 状態表示ラベル } from "./状態表示ラベル";

// キャラタブが集約する部品の型契約(部品DTO)。構築はstaticファクトリに閉じる
export class キャラタブ部品 {
  private constructor(
    readonly フォーム: キャラフォーム,
    readonly 一覧領域: キャラ一覧領域,
    readonly 状態表示: 状態表示ラベル,
  ) {}

  static 作る(文言: キャラタブ内容): キャラタブ部品 {
    return new キャラタブ部品(
      new キャラフォーム(文言),
      new キャラ一覧領域(文言),
      new 状態表示ラベル(),
    );
  }
}
