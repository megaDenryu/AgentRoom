import type { Relayクライアント } from "../通信/Relayクライアント";
import { 送信者名を保存する } from "../送信者名記憶";
import type { ルームタブ部品 } from "./ルームタブ部品";
import type { ルームタブ内容 } from "./ルームタブ内容";
import type { 送信内容 } from "./送信フォーム";

export class ルーム送信サービス {
  constructor(private readonly _room: string, private readonly _部品: ルームタブ部品,
    private readonly _client: Relayクライアント, private readonly _文言: ルームタブ内容) {}
  async 送信する(data: 送信内容): Promise<void> {
    this._部品.送信フォーム.送信中にする(true);
    try {
      await this._client.メッセージを送信する({ ルームID: this._room, 送信者: data.送信者,
        本文: data.本文, 宛先: data.宛先 });
      this._部品.送信フォーム.本文をクリアする(); 送信者名を保存する(data.送信者);
      this._部品.タイムライン.最下部へ移動する();
    } catch (error) {
      this._部品.送信フォーム.エラーを表示する(error instanceof Error ? error.message : this._文言.送信失敗);
    } finally { this._部品.送信フォーム.送信中にする(false); }
  }
}
