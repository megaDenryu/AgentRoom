import type { Relayクライアント } from "../../通信/Relayクライアント";
import type { メッセージDTO } from "../../通信/メッセージ型";
import { ルーム接続 } from "../../通信/ルーム接続";
import { 送信者名を読み込む } from "../../送信者名記憶";
import type { ボトムシート } from "../ボトムシート";
import type { 会話内容 } from "./会話内容";
import type { 会話ビュー部品 } from "./会話ビュー部品";
import { メッセージ行 } from "./メッセージ行";
import { 送信設定シート内容 } from "./送信設定シート内容";

// 会話ビューのロジック層。WS接続(デスクトップと共有するルーム接続)の開始・破棄と、
// 送信・設定シート表示を担う。バックログはWS接続時にサーバーが個別メッセージとして
// 流すため(wsルート.ts参照)、REST側で別途取得する必要はない
export class 会話ビューサービス {
  private readonly _接続: ルーム接続;

  private constructor(
    private readonly _ルームID: string,
    private readonly _部品: 会話ビュー部品,
    private readonly _クライアント: Relayクライアント,
    private readonly _ボトムシート: ボトムシート,
    private readonly _文言: 会話内容,
  ) {
    this._接続 = new ルーム接続(this._ルームID, {
      on新着: (メッセージ) => this._新着を反映する(メッセージ),
      on状態変化: (状態) => this._部品.接続バナー.状態を反映する(状態),
    });
  }

  static 作る(依存: {
    ルームID: string;
    部品: 会話ビュー部品;
    クライアント: Relayクライアント;
    ボトムシート: ボトムシート;
    文言: 会話内容;
  }): 会話ビューサービス {
    return new 会話ビューサービス(
      依存.ルームID,
      依存.部品,
      依存.クライアント,
      依存.ボトムシート,
      依存.文言,
    );
  }

  開始する(): void {
    this._接続.開始する();
  }

  dispose(): void {
    this._接続.破棄する();
    this._ボトムシート.閉じる();
  }

  async 送信する(本文: string): Promise<void> {
    const 送信者 = 送信者名を読み込む();
    this._部品.送信バー.送信中にする(true);
    this._部品.エラー表示.クリアする();
    try {
      await this._クライアント.メッセージを送信する({
        ルームID: this._ルームID,
        送信者,
        本文,
        宛先: null,
      });
      this._部品.送信バー.本文をクリアする();
    } catch (エラー) {
      this._部品.エラー表示.表示する(
        エラー instanceof Error ? エラー.message : this._文言.送信失敗,
      );
    } finally {
      this._部品.送信バー.送信中にする(false);
    }
  }

  設定シートを開く(): void {
    this._ボトムシート.開く(new 送信設定シート内容(this._文言));
  }

  private _新着を反映する(メッセージ: メッセージDTO): void {
    this._部品.メッセージ一覧.追記する(new メッセージ行(メッセージ));
  }
}
