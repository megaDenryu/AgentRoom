import type { Relayクライアント } from "../通信/Relayクライアント";
import type { ルームタブ状態 } from "./ルームタブ状態";
import type { タイムライン反映サービス } from "./タイムライン反映サービス";

export class 未読基準サービス {
  constructor(private readonly _room: string, private readonly _状態: ルームタブ状態,
    private readonly _client: Relayクライアント, private readonly _timeline: タイムライン反映サービス,
    private readonly _読者: () => string) {}
  async 読み込む(): Promise<void> {
    const reader = this._読者(); if (reader.length === 0) return;
    try {
      const info = await this._client.未読情報を取得する({ ルームID: this._room, 読者: reader });
      this._状態.未読区切り基準 = info.既読位置;
      this._状態.送信済み既読位置 = Math.max(this._状態.送信済み既読位置, info.既読位置);
      this._timeline.全件を再描画する();
    } catch (error) { console.error("既読位置の取得に失敗しました", error); }
  }
}
