import type { キャラDTO } from "./キャラ型";
import { RelayメンバーAPI } from "./RelayメンバーAPI";
import { RelayルームAPI } from "./RelayルームAPI";
import { Relay人物API, type キャラ登録入力 } from "./Relay人物API";
import type { メンバーDTO, ルーム概要DTO, 未読情報DTO, 稼働表明DTO } from "./メッセージ型";

export class Relayクライアント {
  private readonly _room = new RelayルームAPI();
  private readonly _member = new RelayメンバーAPI();
  private readonly _person = new Relay人物API();
  ルーム一覧を取得する(読者?: string): Promise<readonly ルーム概要DTO[]> { return this._room.一覧(読者); }
  メッセージを送信する(args: { ルームID: string; 送信者: string; 本文: string; 宛先: string | null }): Promise<void> {
    return this._room.送信(args);
  }
  メンバー一覧を取得する(room: string): Promise<readonly メンバーDTO[]> { return this._member.一覧(room); }
  メンバーを登録する(args: { ルームID: string; 名前: string; 種別: string }): Promise<void> { return this._member.登録(args); }
  メンバーを削除する(args: { ルームID: string; 名前: string }): Promise<void> { return this._member.削除(args); }
  未読情報を取得する(args: { ルームID: string; 読者: string }): Promise<未読情報DTO> { return this._room.未読(args); }
  既読位置を送信する(args: { ルームID: string; 読者: string; 連番: number }): Promise<void> { return this._room.既読(args); }
  稼働一覧を取得する(): Promise<readonly 稼働表明DTO[]> { return this._person.稼働一覧(); }
  キャラ一覧を取得する(): Promise<readonly キャラDTO[]> { return this._person.キャラ一覧(); }
  キャラを登録する(args: キャラ登録入力): Promise<void> { return this._person.キャラ登録(args); }
  キャラを削除する(name: string): Promise<void> { return this._person.キャラ削除(name); }
}
