import type { ルームタブ状態 } from "./ルームタブ状態";
import type { ルームタブ部品 } from "./ルームタブ部品";
import type { タイムライン反映サービス } from "./タイムライン反映サービス";

export class 相手フィルタサービス {
  constructor(private readonly _状態: ルームタブ状態, private readonly _部品: ルームタブ部品,
    private readonly _timeline: タイムライン反映サービス) {}
  切り替える(name: string): void {
    this._状態.フィルタ相手 = this._状態.フィルタ相手 === name ? null : name;
    if (this._状態.フィルタ相手 === null) this._部品.フィルタバナー.隠す();
    else this._部品.フィルタバナー.表示する(this._状態.フィルタ相手);
    this._timeline.全件を再描画する();
  }
  解除する(): void {
    if (this._状態.フィルタ相手 === null) return;
    this._状態.フィルタ相手 = null; this._部品.フィルタバナー.隠す(); this._timeline.全件を再描画する();
  }
}
