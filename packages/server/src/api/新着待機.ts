import type { メッセージ } from "../domain/メッセージ.js";
import type { ルームID } from "../domain/ルームID.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import type { 新着通知ハブ } from "../infra/新着通知ハブ.js";

export type 新着待機結果 =
  | { 種別: "新着あり"; メッセージ一覧: メッセージ[] }
  | { 種別: "タイムアウト" };

// ロングポーリングの本体。AI側ウォッチャー（受信→即終了方式）はこのAPIに
// ぶら下がって新着1件を待つ。参照: DESIGN.md 9.1
export function 新着を待つ(引数: {
  ストア: メッセージストア;
  ハブ: 新着通知ハブ;
  ルーム: ルームID;
  基準連番: number;
  タイムアウトミリ秒: number;
  取得上限: number;
}): Promise<新着待機結果> {
  const { ストア, ハブ, ルーム, 基準連番, タイムアウトミリ秒, 取得上限 } = 引数;

  const 即時取得 = ストア.以降を取得する(ルーム, 基準連番, 取得上限);
  if (即時取得.length > 0) {
    return Promise.resolve({ 種別: "新着あり", メッセージ一覧: 即時取得 });
  }

  return new Promise((resolve) => {
    // 通知が来てからストアを引き直すことで、購読直前に滑り込んだ
    // メッセージも取りこぼさない（通知ペイロードには依存しない）
    const 購読解除 = 引数.ハブ.購読する(ルーム, () => {
      clearTimeout(タイマー);
      購読解除();
      resolve({
        種別: "新着あり",
        メッセージ一覧: ストア.以降を取得する(ルーム, 基準連番, 取得上限),
      });
    });
    const タイマー = setTimeout(() => {
      購読解除();
      resolve({ 種別: "タイムアウト" });
    }, タイムアウトミリ秒);
  });
}
