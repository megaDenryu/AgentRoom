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
import { 表示モードを切り替える } from "../表示モード切替";
import { 現在ロケールを取得する } from "../文言/現在ロケール";
import { ルーム一覧サイドバーサービス } from "./ルーム一覧サイドバーサービス";
import { ルーム一覧サイドバー部品 } from "./ルーム一覧サイドバー部品";
import { サイドバー内容を取得する } from "./サイドバー内容";
import * as styles from "./style.css";

const 定期更新間隔ミリ秒 = 10_000;
export interface Iルーム一覧サイドバー配線 {
  onルーム選択(ルームID: string): void;
  onメンバー選択(名前: string): void;
  on通知有効化(): void;
}

export class ルーム一覧サイドバー
  extends LV2部品集約Base<ルーム一覧サイドバー部品, ルーム一覧サイドバーサービス>
  implements I配線可能<Iルーム一覧サイドバー配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iルーム一覧サイドバー配線>("ルーム一覧サイドバー");
  private readonly _文言 = サイドバー内容を取得する(現在ロケールを取得する());
  private readonly _部品: ルーム一覧サイドバー部品;
  private readonly _サービス: ルーム一覧サイドバーサービス;

  constructor(クライアント: Relayクライアント) {
    super();
    this._部品 = ルーム一覧サイドバー部品.作る(クライアント, this._文言);
    this._サービス = new ルーム一覧サイドバーサービス(
      クライアント,
      this._部品,
      this._文言,
      (ルームID) => this._配線.先.onルーム選択(ルームID),
      (名前) => this._配線.先.onメンバー選択(名前),
    );
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
    void this._サービス.更新する();
    globalThis.setInterval(() => void this._サービス.更新する(), 定期更新間隔ミリ秒);
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
              span({ text: this._文言.タイトル, class: styles.タイトル }),
              button({ text: this._文言.更新ボタン, class: styles.更新ボタン }).onClick(
                () => void サービス.更新する(),
              )]),
          部品.新規ルームフォーム.配線する({
              on作成: (ルームID) => void サービス.ルームを作成する(ルームID),
          }),
          部品.状態表示,
          部品.ルーム一覧,
          div({ class: styles.メンバーヘッダ }).child(部品.メンバー見出し),
          部品.メンバー追加フォーム.配線する({
              on追加: (名前, 種別) => void サービス.メンバーを追加する(名前, 種別),
          }),
          部品.メンバー一覧,
          部品.稼働状況パネル,
          button({ text: this._文言.通知有効化ボタン, class: styles.通知ボタン }).onClick(() =>
            this._配線.先.on通知有効化(),
          ),
          部品.通知状態,
          button({
            text: this._文言.表示切替ボタン,
            class: styles.表示切替ボタン,
          }).onClick(() => 表示モードを切り替える("mobile")),
          部品.言語選択])
    );
  }

  選択ルームを設定する(ルームID: string | null): void {
    this._サービス.選択ルームを設定する(ルームID);
  }

  通知状態を表示する(文言: string): void {
    this._部品.通知状態.表示する(文言);
  }

  更新する(): Promise<void> {
    return this._サービス.更新する();
  }
}
