import { ページが表示されたら } from "../ページ可視性";
import type { 通知サービス } from "../通知サービス";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { ルーム接続 } from "../通信/ルーム接続";
import { 既読送信サービス } from "./既読送信サービス";
import { メンバー同期サービス } from "./メンバー同期サービス";
import type { ルームタブ状態 } from "./ルームタブ状態";
import type { ルームタブ部品 } from "./ルームタブ部品";
import type { ルームタブ内容 } from "./ルームタブ内容";
import type { 送信内容 } from "./送信フォーム";
import { タイムライン反映サービス } from "./タイムライン反映サービス";
import { ルーム送信サービス } from "./ルーム送信サービス";
import { 未読基準サービス } from "./未読基準サービス";
import { 相手フィルタサービス } from "./相手フィルタサービス";

export class ルームタブサービス {
  private readonly _接続: ルーム接続;
  private readonly _既読送信: 既読送信サービス;
  private readonly _メンバー同期: メンバー同期サービス;
  private readonly _タイムライン反映: タイムライン反映サービス;
  private readonly _送信: ルーム送信サービス;
  private readonly _未読: 未読基準サービス;
  private readonly _フィルタ: 相手フィルタサービス;
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
    this._送信 = new ルーム送信サービス(_ルームID, _部品, _クライアント, _文言);
    this._未読 = new 未読基準サービス(_ルームID, _状態, _クライアント,
      this._タイムライン反映, () => this._自分の名前());
    this._フィルタ = new 相手フィルタサービス(_状態, _部品, this._タイムライン反映);
  }

  static 作る(依存: { ルームID: string; 状態: ルームタブ状態; 部品: ルームタブ部品;
    クライアント: Relayクライアント; 通知: 通知サービス; 文言: ルームタブ内容 }): ルームタブサービス {
    return new ルームタブサービス(依存.ルームID, 依存.状態, 依存.部品,
      依存.クライアント, 依存.通知, 依存.文言);
  }

  開始する(): void {
    this._接続.開始する();
    void this._未読.読み込む();
    this._メンバー同期.開始する();
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
    await this._送信.送信する(内容);
  }

  相手フィルタを切り替える(名前: string): void {
    this._フィルタ.切り替える(名前);
  }

  フィルタを解除する(): void {
    this._フィルタ.解除する();
  }

  既読送信を予約する(): void {
    this._既読送信.予約する();
  }

  private _自分の名前(): string {
    return this._部品.送信フォーム.送信者名();
  }

}
