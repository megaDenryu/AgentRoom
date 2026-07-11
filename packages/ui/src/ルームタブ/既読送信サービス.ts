import { ページが非表示か } from "../ページ可視性";
import type { Relayクライアント } from "../通信/Relayクライアント";
import type { ルームタブ状態 } from "./ルームタブ状態";
import type { ルームタブ部品 } from "./ルームタブ部品";

const 既読送信デバウンスミリ秒 = 800;

// 既読位置の送信を担うサービス。「タブが表示中 かつ 最下部に到達」のときだけ
// デバウンス付きで進める。参照: DESIGN.md 10章（明示API方式の理由）
export class 既読送信サービス {
  private _タイマーID: number | null = null;

  constructor(
    private readonly _ルームID: string,
    private readonly _状態: ルームタブ状態,
    private readonly _部品: ルームタブ部品,
    private readonly _クライアント: Relayクライアント,
  ) {}

  予約する(): void {
    if (ページが非表示か()) return;
    if (!this._部品.タイムライン.最下部にいるか()) return;
    if (this._状態.受信済み最終連番() <= this._状態.送信済み既読位置) return;
    const 読者 = this._部品.送信フォーム.送信者名();
    if (読者.length === 0) return;

    if (this._タイマーID !== null) {
      window.clearTimeout(this._タイマーID);
    }
    this._タイマーID = window.setTimeout(() => {
      this._タイマーID = null;
      const 連番 = this._状態.受信済み最終連番();
      this._クライアント
        .既読位置を送信する({ ルームID: this._ルームID, 読者, 連番 })
        .then(() => {
          this._状態.送信済み既読位置 = Math.max(this._状態.送信済み既読位置, 連番);
        })
        .catch((エラー: unknown) => {
          console.error("既読位置の送信に失敗しました", エラー);
        });
    }, 既読送信デバウンスミリ秒);
  }

  dispose(): void {
    if (this._タイマーID !== null) {
      window.clearTimeout(this._タイマーID);
      this._タイマーID = null;
    }
  }
}
