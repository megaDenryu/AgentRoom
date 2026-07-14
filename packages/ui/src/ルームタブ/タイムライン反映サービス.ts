import type { メッセージDTO } from "../通信/メッセージ型";
import type { 通知サービス } from "../通知サービス";
import type { タイムライン項目 } from "./メッセージ一覧領域";
import { メッセージ行View } from "./メッセージ行View";
import type { ルームタブ状態 } from "./ルームタブ状態";
import type { ルームタブ部品 } from "./ルームタブ部品";
import type { ルームタブ内容 } from "./ルームタブ内容";
import { 未読区切りView } from "./未読区切りView";

// WS接続時のバックログ再生をデスクトップ通知でスパムしないための「新しさ」判定
const 通知対象の新しさミリ秒 = 10_000;

// 受信メッセージのタイムライン反映（差分追記・全件再描画）と新着通知の発火を担うサービス
export class タイムライン反映サービス {
  constructor(
    private readonly _ルームID: string,
    private readonly _状態: ルームタブ状態,
    private readonly _部品: ルームタブ部品,
    private readonly _通知: 通知サービス,
    private readonly _文言: ルームタブ内容,
    private readonly _自分の名前: () => string,
    private readonly _既読送信を予約する: () => void,
  ) {}

  新着を反映する(メッセージ: メッセージDTO): void {
    this._状態.全メッセージ.push(メッセージ);
    if (this._状態.表示対象か(メッセージ)) {
      const 区切りが必要 =
        !this._状態.区切り表示済み &&
        this._状態.未読区切り対象か(メッセージ, this._自分の名前());
      if (区切りが必要) {
        this._状態.区切り表示済み = true;
      }
      this._部品.タイムライン.追記する(
        this._行を作る(メッセージ),
        区切りが必要 ? new 未読区切りView(this._文言) : null,
      );
    }
    const 新しい =
      Date.now() - new Date(メッセージ.送信時刻).getTime() < 通知対象の新しさミリ秒;
    if (新しい && メッセージ.送信者 !== this._自分の名前()) {
      this._通知.新着を知らせる({
        送信者: メッセージ.送信者,
        本文: メッセージ.本文,
        ルームID: this._ルームID,
      });
    }
    this._既読送信を予約する();
  }

  全件を再描画する(): void {
    const 自分 = this._自分の名前();
    const 項目一覧: タイムライン項目[] = [];
    let 区切り済み = false;
    for (const メッセージ of this._状態.全メッセージ) {
      if (!this._状態.表示対象か(メッセージ)) continue;
      if (!区切り済み && this._状態.未読区切り対象か(メッセージ, 自分)) {
        項目一覧.push(new 未読区切りView(this._文言));
        区切り済み = true;
      }
      項目一覧.push(this._行を作る(メッセージ));
    }
    this._状態.区切り表示済み = 区切り済み;
    this._部品.タイムライン.全件を差し替える(項目一覧);
  }

  private _行を作る(メッセージ: メッセージDTO): メッセージ行View {
    return new メッセージ行View(
      メッセージ,
      { 送信者は人間か: this._状態.メンバー種別.get(メッセージ.送信者) === "human" },
      this._文言,
    );
  }
}
