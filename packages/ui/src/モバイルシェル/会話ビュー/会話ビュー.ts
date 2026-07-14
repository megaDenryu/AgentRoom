import {
  button,
  div,
  span,
  LV2部品集約Base,
  配線ポート,
  type DivC,
  type I配線可能,
} from "sengen-ui";
import { 戻るアイコン } from "../../アイコン";
import type { Relayクライアント } from "../../通信/Relayクライアント";
import type { ボトムシート } from "../ボトムシート";
import { 会話ビュー部品 } from "./会話ビュー部品";
import { 会話ビューサービス } from "./会話ビューサービス";
import * as styles from "./style.css";

export interface I会話ビュー配線 {
  on戻る(): void;
}

// 1ルーム分の会話画面(モバイル専用のLV2部品集約)。デスクトップのルームタブと同じ
// データ層(ルーム接続・Relayクライアント)を使うが、単一フルスクリーン+タップ操作前提で
// 部品構成を作り直している(フィルタ・既読位置送信・宛先個別指定は今回のスコープ外)
export class 会話ビュー
  extends LV2部品集約Base<会話ビュー部品, 会話ビューサービス>
  implements I配線可能<I会話ビュー配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I会話ビュー配線>("会話ビュー");
  private readonly _部品: 会話ビュー部品;
  private readonly _サービス: 会話ビューサービス;

  constructor(
    private readonly _ルームID: string,
    クライアント: Relayクライアント,
    ボトムシート: ボトムシート,
  ) {
    super();
    this._部品 = 会話ビュー部品.作る();
    this._サービス = 会話ビューサービス.作る({
      ルームID: this._ルームID,
      部品: this._部品,
      クライアント,
      ボトムシート,
    });
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
    this._サービス.開始する();
  }

  配線する(配線: I会話ビュー配線): this {
    this._配線.配線する(配線);
    return this;
  }

  protected _ルートを構築する(部品: 会話ビュー部品, サービス: 会話ビューサービス): DivC {
    return (
      div({ class: styles.ルート }).childs([
          div({ class: styles.ヘッダ }).childs([
              button({ class: styles.戻るボタン })
                  .child(戻るアイコン(22, "currentColor"))
                  .onClick(() => this._配線.先.on戻る()),
              span({ text: this._ルームID, class: styles.タイトル })]),
          部品.接続バナー,
          部品.メッセージ一覧,
          部品.エラー表示,
          部品.送信バー.配線する({
              on送信: (本文) => void サービス.送信する(本文),
              on設定を開く: () => サービス.設定シートを開く(),
          })])
    );
  }

  dispose(): void {
    this._サービス.dispose();
  }
}
