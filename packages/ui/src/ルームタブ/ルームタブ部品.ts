import { タイムラインView } from "./タイムラインView";
import { フィルタバナー } from "./フィルタバナー";
import { 接続バナー } from "./接続バナー";
import { 送信フォーム } from "./送信フォーム";

// ルームタブが集約する部品の型契約（部品DTO）。構築はstaticファクトリに閉じる
export class ルームタブ部品 {
  private constructor(
    readonly 接続バナー: 接続バナー,
    readonly フィルタバナー: フィルタバナー,
    readonly タイムライン: タイムラインView,
    readonly 送信フォーム: 送信フォーム,
  ) {}

  static 作る(): ルームタブ部品 {
    return new ルームタブ部品(
      new 接続バナー(),
      new フィルタバナー(),
      new タイムラインView(),
      new 送信フォーム(),
    );
  }
}
