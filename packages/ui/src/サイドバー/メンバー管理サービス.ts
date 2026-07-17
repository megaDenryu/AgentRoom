import type { Relayクライアント } from "../通信/Relayクライアント";
import type { ルーム一覧サイドバー部品 } from "./ルーム一覧サイドバー部品";
import { メンバー項目View } from "./メンバー項目View";
import type { サイドバー内容 } from "./サイドバー内容";

export class メンバー管理サービス {
  private _room: string | null = null;
  constructor(private readonly _client: Relayクライアント, private readonly _部品: ルーム一覧サイドバー部品,
    private readonly _文言: サイドバー内容, private readonly _on選択: (name: string) => void) {}
  選択ルームを設定する(room: string | null): void {
    if (this._room === room) return; this._room = room; this._部品.メンバー見出し.ルームを表示する(room);
    if (room === null) this._部品.メンバー一覧.未選択を表示する(); else void this.更新する();
  }
  async 更新する(): Promise<void> {
    if (this._room === null) return;
    const members = await this._client.メンバー一覧を取得する(this._room);
    this._部品.メンバー一覧.全件を差し替える(members.map((member) =>
      new メンバー項目View(member, this._文言).配線する({
        on選択: () => this._on選択(member.名前), on削除: () => void this.削除する(member.名前),
      }),
    ));
  }
  async 候補を更新する(): Promise<void> {
    try { const list = await this._client.キャラ一覧を取得する();
      this._部品.メンバー追加フォーム.キャラ候補を更新する(list.map((item) => item.名前));
    } catch { this._部品.メンバー追加フォーム.キャラ候補を更新する([]); }
  }
  async 追加する(name: string, kind: string): Promise<void> {
    if (this._room === null) { this._部品.状態表示.エラーを表示する(this._文言.ルーム未選択エラー); return; }
    try {
      await this._client.メンバーを登録する({ ルームID: this._room, 名前: name, 種別: kind });
      this._部品.メンバー追加フォーム.クリアする(); this._部品.状態表示.クリアする(); await this.更新する();
    } catch (error) { this._エラー(error, this._文言.メンバー追加失敗); }
  }
  async 削除する(name: string): Promise<void> {
    if (this._room === null) return;
    try { await this._client.メンバーを削除する({ ルームID: this._room, 名前: name });
      this._部品.状態表示.クリアする(); await this.更新する();
    } catch (error) { this._エラー(error, this._文言.メンバー削除失敗); }
  }
  private _エラー(error: unknown, text: string): void {
    this._部品.状態表示.エラーを表示する(error instanceof Error ? error.message : text);
  }
}
