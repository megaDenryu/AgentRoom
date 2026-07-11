import {
  button,
  div,
  span,
  LV2部品集約Base,
  配線ポート,
  type DivC,
  type I配線可能,
} from "sengen-ui";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { メンバー一覧領域 } from "./メンバー一覧領域";
import { メンバー見出しラベル } from "./メンバー見出しラベル";
import { ルーム一覧サイドバーサービス } from "./ルーム一覧サイドバーサービス";
import { ルーム一覧サイドバー部品 } from "./ルーム一覧サイドバー部品";
import { ルーム一覧領域 } from "./ルーム一覧領域";
import { 状態表示ラベル } from "./状態表示ラベル";
import * as styles from "./style.css";

const 定期更新間隔ミリ秒 = 10_000;

export interface Iルーム一覧サイドバー配線 {
  onルーム選択(ルームID: string): void;
  // メンバー行クリック = 選択中ルームタブの1対1フィルタ切替
  onメンバー選択(名前: string): void;
  on通知有効化(): void;
}

// 右サイドバー（LV2部品集約）。上段=ルーム一覧（未読バッジ・新規ルーム作成）、
// 下段=選択中ルームのメンバー一覧（追加・削除）。定期更新+手動更新でAPIを取得する。
// API呼び出しロジックはルーム一覧サイドバーサービスに集約し、本体は配線に徹する
export class ルーム一覧サイドバー
  extends LV2部品集約Base<ルーム一覧サイドバー部品, ルーム一覧サイドバーサービス>
  implements I配線可能<Iルーム一覧サイドバー配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iルーム一覧サイドバー配線>("ルーム一覧サイドバー");
  private readonly _部品: ルーム一覧サイドバー部品;
  private readonly _ルーム一覧 = new ルーム一覧領域();
  private readonly _メンバー一覧 = new メンバー一覧領域();
  private readonly _メンバー見出し = new メンバー見出しラベル();
  private readonly _状態表示 = new 状態表示ラベル();
  private readonly _サービス: ルーム一覧サイドバーサービス;

  constructor(クライアント: Relayクライアント) {
    super();
    this._部品 = ルーム一覧サイドバー部品.作る();
    this._サービス = new ルーム一覧サイドバーサービス(
      クライアント,
      this._部品,
      this._ルーム一覧,
      this._メンバー一覧,
      this._メンバー見出し,
      this._状態表示,
      (ルームID) => this._配線.先.onルーム選択(ルームID),
      (名前) => this._配線.先.onメンバー選択(名前),
    );
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
    void this._サービス.更新する();
    // サイドバーはアプリと同寿命なのでタイマーの解除は不要
    window.setInterval(() => void this._サービス.更新する(), 定期更新間隔ミリ秒);
  }

  配線する(配線: Iルーム一覧サイドバー配線): this {
    this._配線.配線する(配線);
    return this;
  }

  protected _ルートを構築する(
    部品: ルーム一覧サイドバー部品,
    サービス: ルーム一覧サイドバーサービス,
  ): DivC {
    return (
      div({ class: styles.ルート }).childs([
          div({ class: styles.ヘッダ }).childs([
              span({ text: "ルーム一覧", class: styles.タイトル }),
              button({ text: "更新", class: styles.更新ボタン }).onClick(
                () => void サービス.更新する(),
              )]),
          部品.新規ルームフォーム.配線する({
              on作成: (ルームID) => void サービス.ルームを作成する(ルームID),
          }),
          this._状態表示,
          this._ルーム一覧,
          div({ class: styles.メンバーヘッダ }).child(this._メンバー見出し),
          部品.メンバー追加フォーム.配線する({
              on追加: (名前, 種別) => void サービス.メンバーを追加する(名前, 種別),
          }),
          this._メンバー一覧,
          button({ text: "通知を有効化", class: styles.通知ボタン }).onClick(() =>
            this._配線.先.on通知有効化(),
          )])
    );
  }

  選択ルームを設定する(ルームID: string | null): void {
    this._サービス.選択ルームを設定する(ルームID);
  }

  更新する(): Promise<void> {
    return this._サービス.更新する();
  }
}
