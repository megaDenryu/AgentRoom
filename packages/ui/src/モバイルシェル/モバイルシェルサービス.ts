import type { Relayクライアント } from "../通信/Relayクライアント";
import { 会話ビュー } from "./会話ビュー/会話ビュー";
import { キャラナビ項目id, ルームナビ項目id, 札場ナビ項目id } from "./ナビ項目一覧";
import type { モバイルシェル部品 } from "./モバイルシェル部品";
import { 画面表示状態 } from "./状態";

// モバイルシェルのロジック層。ルーム一覧⇔会話⇔札場⇔キャラの画面切替(単一フルスクリーン
// ビューの差し替え)を担う。会話ビューはWS接続を持つため、離れるときに必ず破棄する。
// 下部ナビの選択見た目は、この画面切替に追従させて唯一の真実(現在どの画面か)から反映する
export class モバイルシェルサービス {
  private _現在の会話ビュー: 会話ビュー | null = null;

  private constructor(
    private readonly _部品: モバイルシェル部品,
    private readonly _クライアント: Relayクライアント,
  ) {}

  static 作る(部品: モバイルシェル部品, クライアント: Relayクライアント): モバイルシェルサービス {
    return new モバイルシェルサービス(部品, クライアント);
  }

  ルームを開く(ルームID: string): void {
    this._会話ビューを破棄する();
    const 会話 = new 会話ビュー(ルームID, this._クライアント, this._部品.ボトムシート).配線する({
      on戻る: () => this.一覧へ戻る(),
    });
    this._現在の会話ビュー = 会話;
    this._部品.会話スロット.clearChildren().child(会話);
    this._全画面を隠す();
    this._部品.会話スロット.setAttribute(画面表示状態.attribute, 画面表示状態.value.表示);
    this._部品.下部ナビ.選択する(ルームナビ項目id);
  }

  一覧へ戻る(): void {
    this._会話ビューを破棄する();
    this._全画面を隠す();
    this._部品.ルーム一覧ビュー.setAttribute(画面表示状態.attribute, 画面表示状態.value.表示);
    this._部品.下部ナビ.選択する(ルームナビ項目id);
    void this._部品.ルーム一覧ビュー.更新する();
  }

  札場を開く(): void {
    this._会話ビューを破棄する();
    this._全画面を隠す();
    this._部品.札場スロット.setAttribute(画面表示状態.attribute, 画面表示状態.value.表示);
    this._部品.下部ナビ.選択する(札場ナビ項目id);
  }

  キャラを開く(): void {
    this._会話ビューを破棄する();
    this._全画面を隠す();
    this._部品.キャラ一覧ビュー.setAttribute(画面表示状態.attribute, 画面表示状態.value.表示);
    this._部品.下部ナビ.選択する(キャラナビ項目id);
    void this._部品.キャラ一覧ビュー.更新する();
  }

  private _会話ビューを破棄する(): void {
    this._現在の会話ビュー?.dispose();
    this._現在の会話ビュー?.delete();
    this._現在の会話ビュー = null;
  }

  private _全画面を隠す(): void {
    this._部品.会話スロット.setAttribute(画面表示状態.attribute, 画面表示状態.value.非表示);
    this._部品.ルーム一覧ビュー.setAttribute(画面表示状態.attribute, 画面表示状態.value.非表示);
    this._部品.札場スロット.setAttribute(画面表示状態.attribute, 画面表示状態.value.非表示);
    this._部品.キャラ一覧ビュー.setAttribute(画面表示状態.attribute, 画面表示状態.value.非表示);
  }
}
