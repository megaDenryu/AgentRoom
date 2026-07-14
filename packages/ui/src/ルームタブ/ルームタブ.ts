import { div, LV2部品集約Base, type DivC } from "sengen-ui";
import type { 通知サービス } from "../通知サービス";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { 現在ロケールを取得する } from "../文言/現在ロケール";
import { ルームタブサービス } from "./ルームタブサービス";
import { ルームタブ状態 } from "./ルームタブ状態";
import { ルームタブ内容を取得する } from "./ルームタブ内容";
import { ルームタブ部品 } from "./ルームタブ部品";
import * as styles from "./style.css";

// 1ルーム分の会話タイムラインタブ（LV2部品集約）。WSでバックログ+リアルタイム受信し、
// 下部のフォームから人間が発言できる。ロジックはルームタブサービスに集約し、本体は配線に徹する
export class ルームタブ extends LV2部品集約Base<ルームタブ部品, ルームタブサービス> {
  protected _componentRoot: DivC;
  private readonly _部品: ルームタブ部品;
  private readonly _サービス: ルームタブサービス;

  constructor(ルームID: string, クライアント: Relayクライアント, 通知: 通知サービス) {
    super();
    const 状態 = new ルームタブ状態();
    const 文言 = ルームタブ内容を取得する(現在ロケールを取得する());
    this._部品 = ルームタブ部品.作る(文言);
    this._サービス = ルームタブサービス.作る({
      ルームID,
      状態,
      部品: this._部品,
      クライアント,
      通知,
      文言,
    });
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
    this._サービス.開始する();
  }

  protected _ルートを構築する(部品: ルームタブ部品, サービス: ルームタブサービス): DivC {
    return (
      div({ class: styles.ルート }).childs([
          部品.接続バナー,
          部品.フィルタバナー.配線する({
              on解除: () => サービス.フィルタを解除する(),
          }),
          部品.タイムライン.配線する({
              on最下部到達: () => サービス.既読送信を予約する(),
          }),
          部品.送信フォーム.配線する({
              on送信: (内容) => void サービス.送信する(内容),
          })])
    );
  }

  相手フィルタを切り替える(名前: string): void {
    this._サービス.相手フィルタを切り替える(名前);
  }

  dispose(): void {
    this._サービス.dispose();
  }
}
