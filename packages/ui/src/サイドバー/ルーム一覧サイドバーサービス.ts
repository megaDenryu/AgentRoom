import type { Relayクライアント } from "../通信/Relayクライアント";
import { 送信者名を読み込む } from "../送信者名記憶";
import { 現在ロケールを取得する } from "../文言/現在ロケール";
import { ルームIDが妥当か, ルームID不正時のメッセージを返す } from "./ルームID検証";
import { ルーム項目View } from "./ルーム項目View";
import type { サイドバー内容 } from "./サイドバー内容";
import { メンバー管理サービス } from "./メンバー管理サービス";
import type { ルーム一覧サイドバー部品 } from "./ルーム一覧サイドバー部品";

export class ルーム一覧サイドバーサービス {
  private readonly _メンバー: メンバー管理サービス;
  constructor(private readonly _client: Relayクライアント, private readonly _部品: ルーム一覧サイドバー部品,
    private readonly _文言: サイドバー内容, private readonly _onRoom: (id: string) => void,
    onMember: (name: string) => void) {
    this._メンバー = new メンバー管理サービス(_client, _部品, _文言, onMember);
  }
  選択ルームを設定する(id: string | null): void { this._メンバー.選択ルームを設定する(id); }
  async 更新する(): Promise<void> {
    try {
      const list = await this._client.ルーム一覧を取得する(送信者名を読み込む());
      this._部品.ルーム一覧.全件を差し替える(list.map((room) =>
        new ルーム項目View(room, this._文言).配線する({ on選択: () => this._onRoom(room.ルームID) }),
      ));
      await this._メンバー.更新する(); await this._メンバー.候補を更新する(); this._部品.状態表示.クリアする();
    } catch (error) { this._エラー(error, this._文言.一覧取得失敗); }
  }
  async ルームを作成する(id: string): Promise<void> {
    if (!ルームIDが妥当か(id)) {
      this._部品.状態表示.エラーを表示する(ルームID不正時のメッセージを返す(現在ロケールを取得する())); return;
    }
    try {
      await this._client.メンバーを登録する({ ルームID: id, 名前: 送信者名を読み込む(), 種別: "human" });
      this._部品.新規ルームフォーム.クリアする(); this._部品.状態表示.クリアする();
      this._onRoom(id); await this.更新する();
    } catch (error) { this._エラー(error, this._文言.作成失敗); }
  }
  メンバーを追加する(name: string, kind: string): Promise<void> { return this._メンバー.追加する(name, kind); }
  メンバーを削除する(name: string): Promise<void> { return this._メンバー.削除する(name); }
  private _エラー(error: unknown, text: string): void {
    this._部品.状態表示.エラーを表示する(error instanceof Error ? error.message : text);
  }
}
