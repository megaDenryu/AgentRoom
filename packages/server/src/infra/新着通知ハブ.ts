import type { メッセージ } from "../domain/メッセージ.js";
import type { ルームID } from "../domain/ルームID.js";

type 新着リスナ = (メッセージ: メッセージ) => void;

// ロングポーリング待機者とWebSocket購読者の両方がここにぶら下がる。
// プロセス内メモリのみで永続化しない（履歴の真実はメッセージストア側にある）
export class 新着通知ハブ {
  private readonly ルーム別リスナ = new Map<string, Set<新着リスナ>>();

  購読する(ルーム: ルームID, リスナ: 新着リスナ): () => void {
    const キー = ルーム.値;
    const 既存 = this.ルーム別リスナ.get(キー);
    const リスナ集合 = 既存 ?? new Set<新着リスナ>();
    if (!既存) {
      this.ルーム別リスナ.set(キー, リスナ集合);
    }
    リスナ集合.add(リスナ);
    return () => {
      リスナ集合.delete(リスナ);
      if (リスナ集合.size === 0) {
        this.ルーム別リスナ.delete(キー);
      }
    };
  }

  通知する(メッセージ: メッセージ): void {
    const リスナ集合 = this.ルーム別リスナ.get(メッセージ.ルーム.値);
    if (!リスナ集合) return;
    // 通知中の購読解除でイテレータが壊れないようスナップショットを取る
    for (const リスナ of [...リスナ集合]) {
      リスナ(メッセージ);
    }
  }
}
