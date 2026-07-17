import { 狭幅ブレークポイントpx } from "../レスポンシブ";
import { ルームタブ } from "../ルームタブ/ルームタブ";
import type { 通知サービス } from "../通知サービス";
import type { Relayクライアント } from "../通信/Relayクライアント";
import type { アプリシェル部品 } from "./アプリシェル部品";

const 接頭辞 = "ルーム:";
export class ルームタブ管理サービス {
  private readonly _tabs = new Map<string, ルームタブ>();
  private _selected: string | null = null;
  constructor(private readonly _部品: アプリシェル部品, private readonly _client: Relayクライアント,
    private readonly _通知: 通知サービス) {}
  開く(room: string): void {
    const id = `${接頭辞}${room}`;
    if (!this._部品.外殻.タブが存在するか(id)) {
      const tab = new ルームタブ(room, this._client, this._通知);
      this._tabs.set(id, tab); this._部品.外殻.タブを追加する(id, room, tab);
    }
    this._部品.外殻.タブを選択する(id);
    if (window.innerWidth < 狭幅ブレークポイントpx) this._部品.外殻.サイドバーを切り替える();
  }
  閉じる(id: string): void {
    this._tabs.get(id)?.dispose(); this._tabs.delete(id);
    if (this._selected === id) { this._selected = null; this._部品.サイドバー.選択ルームを設定する(null); }
  }
  選択を反映する(id: string): void {
    this._selected = id; this._部品.サイドバー.選択ルームを設定する(
      id.startsWith(接頭辞) ? id.slice(接頭辞.length) : null,
    );
  }
  相手フィルタを切り替える(name: string): void {
    if (this._selected !== null) this._tabs.get(this._selected)?.相手フィルタを切り替える(name);
  }
}
