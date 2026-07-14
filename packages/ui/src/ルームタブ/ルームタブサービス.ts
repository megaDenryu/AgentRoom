import { ページが表示されたら } from "../ページ可視性";
import type { 通知サービス } from "../通知サービス";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { ルーム接続 } from "../通信/ルーム接続";
import { 送信者名を保存する } from "../送信者名記憶";
import { 既読送信サービス } from "./既読送信サービス";
import { メンバー同期サービス } from "./メンバー同期サービス";
import type { ルームタブ状態 } from "./ルームタブ状態";
import type { ルームタブ部品 } from "./ルームタブ部品";
import type { ルームタブ内容 } from "./ルームタブ内容";
import type { 送信内容 } from "./送信フォーム";
import { タイムライン反映サービス } from "./タイムライン反映サービス";

// ルームタブのロジック層。WS接続・既読送信・メンバー同期・タイムライン反映の
// 各サービスを束ね、ルームタブ本体は配線に徹する
export class ルームタブサービス {
  private readonly _接続: ルーム接続;
  private readonly _既読送信: 既読送信サービス;
  private readonly _メンバー同期: メンバー同期サービス;
  private readonly _タイムライン反映: タイムライン反映サービス;
  private _可視性購読解除: (() => void) | null = null;

  private constructor(
    private readonly _ルームID: string,
    private readonly _状態: ルームタブ状態,
    private readonly _部品: ルームタブ部品,
    private readonly _クライアント: Relayクライアント,
    通知: 通知サービス,
    private readonly _文言: ルームタブ内容,
  ) {
    this._既読送信 = new 既読送信サービス(_ルームID, _状態, _部品, _クライアント);
    this._タイムライン反映 = new タイムライン反映サービス(
      _ルームID,
      _状態,
      _部品,
      通知,
      this._文言,
      () => this._自分の名前(),
      () => this._既読送信.予約する(),
    );
    this._メンバー同期 = new メンバー同期サービス(_ルームID, _状態, _部品, _クライアント, () =>
      this._タイムライン反映.全件を再描画する(),
    );
    this._接続 = new ルーム接続(this._ルームID, {
      on新着: (メッセージ) => this._タイムライン反映.新着を反映する(メッセージ),
      on状態変化: (状態) => this._部品.接続バナー.状態を反映する(状態),
    });
  }

  static 作る(依存: {
    ルームID: string;
    状態: ルームタブ状態;
    部品: ルームタブ部品;
    クライアント: Relayクライアント;
    通知: 通知サービス;
    文言: ルームタブ内容;
  }): ルームタブサービス {
    return new ルームタブサービス(
      依存.ルームID,
      依存.状態,
      依存.部品,
      依存.クライアント,
      依存.通知,
      依存.文言,
    );
  }

  開始する(): void {
    this._接続.開始する();
    void this._未読基準を読み込む();
    this._メンバー同期.開始する();
    // タブが再び表示されたとき、最下部にいれば既読を進める
    this._可視性購読解除 = ページが表示されたら(() => this._既読送信.予約する());
  }

  dispose(): void {
    this._接続.破棄する();
    this._メンバー同期.dispose();
    this._既読送信.dispose();
    this._可視性購読解除?.();
    this._可視性購読解除 = null;
  }

  async 送信する(内容: 送信内容): Promise<void> {
    this._部品.送信フォーム.送信中にする(true);
    try {
      await this._クライアント.メッセージを送信する({
        ルームID: this._ルームID,
        送信者: 内容.送信者,
        本文: 内容.本文,
        宛先: 内容.宛先,
      });
      this._部品.送信フォーム.本文をクリアする();
      送信者名を保存する(内容.送信者);
      // 自分の発言はWS経由で戻ってくる。追従を再開して到着時に最下部へ流す
      this._部品.タイムライン.最下部へ移動する();
    } catch (エラー) {
      this._部品.送信フォーム.エラーを表示する(
        エラー instanceof Error ? エラー.message : this._文言.送信失敗,
      );
    } finally {
      this._部品.送信フォーム.送信中にする(false);
    }
  }

  相手フィルタを切り替える(名前: string): void {
    this._状態.フィルタ相手 = this._状態.フィルタ相手 === 名前 ? null : 名前;
    if (this._状態.フィルタ相手 === null) {
      this._部品.フィルタバナー.隠す();
    } else {
      this._部品.フィルタバナー.表示する(this._状態.フィルタ相手);
    }
    this._タイムライン反映.全件を再描画する();
  }

  フィルタを解除する(): void {
    if (this._状態.フィルタ相手 === null) return;
    this._状態.フィルタ相手 = null;
    this._部品.フィルタバナー.隠す();
    this._タイムライン反映.全件を再描画する();
  }

  既読送信を予約する(): void {
    this._既読送信.予約する();
  }

  private _自分の名前(): string {
    return this._部品.送信フォーム.送信者名();
  }

  private async _未読基準を読み込む(): Promise<void> {
    const 読者 = this._自分の名前();
    if (読者.length === 0) return;
    try {
      const 情報 = await this._クライアント.未読情報を取得する({
        ルームID: this._ルームID,
        読者,
      });
      this._状態.未読区切り基準 = 情報.既読位置;
      this._状態.送信済み既読位置 = Math.max(
        this._状態.送信済み既読位置,
        情報.既読位置,
      );
      this._タイムライン反映.全件を再描画する();
    } catch (エラー: unknown) {
      // 区切り線が出ないだけでタイムライン自体は成立するため、表示は継続する
      console.error("既読位置の取得に失敗しました", エラー);
    }
  }
}
