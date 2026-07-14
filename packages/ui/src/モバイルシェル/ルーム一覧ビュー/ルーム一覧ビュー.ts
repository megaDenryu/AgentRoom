import {
  button,
  div,
  span,
  LV2HtmlComponentBase,
  配線ポート,
  type DivC,
  type I配線可能,
} from "sengen-ui";
import { 追加アイコン } from "../../アイコン";
import type { Relayクライアント } from "../../通信/Relayクライアント";
import { 表示モードを切り替える } from "../../表示モード切替";
import { エラー表示ラベル } from "../エラー表示ラベル";
import * as 共有styles from "../style.css";
import { 画面表示状態 } from "../状態";
import type { ボトムシート } from "../ボトムシート";
import { ルーム一覧ビューサービス } from "./ルーム一覧ビューサービス";
import { ルーム一覧領域 } from "./ルーム一覧領域";
import * as styles from "./style.css";

const 定期更新間隔ミリ秒 = 10_000;

export interface Iルーム一覧ビュー配線 {
  onルーム選択(ルームID: string): void;
}

// 単一フルスクリーンビューの1つ「ルーム一覧」(LV2素部品)。デスクトップのルーム一覧
// サイドバーからメンバー管理・ルーム作成を外し、閲覧と選択だけに絞っている
// (今回のモバイル対応スコープ=会話のみ、ARCHITECTURE.md参照)
export class ルーム一覧ビュー
  extends LV2HtmlComponentBase
  implements I配線可能<Iルーム一覧ビュー配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iルーム一覧ビュー配線>("ルーム一覧ビュー");
  private readonly _リスト = new ルーム一覧領域();
  private readonly _エラー表示 = new エラー表示ラベル();
  private readonly _サービス: ルーム一覧ビューサービス;

  constructor(クライアント: Relayクライアント, ボトムシート: ボトムシート) {
    super();
    this._サービス = new ルーム一覧ビューサービス(
      クライアント,
      ボトムシート,
      this._リスト,
      this._エラー表示,
      (ルームID) => this._配線.先.onルーム選択(ルームID),
    );
    this._componentRoot = this._ルートを構築する();
    void this._サービス.更新する();
    window.setInterval(() => void this._サービス.更新する(), 定期更新間隔ミリ秒);
  }

  配線する(配線: Iルーム一覧ビュー配線): this {
    this._配線.配線する(配線);
    return this;
  }

  更新する(): Promise<void> {
    return this._サービス.更新する();
  }

  private _ルートを構築する(): DivC {
    return (
      div({ class: [共有styles.画面, styles.ルート] })
        .setAttribute(画面表示状態.attribute, 画面表示状態.value.表示)
        .childs([
            div({ class: styles.ヘッダ }).childs([
                span({ text: "ルーム一覧", class: styles.タイトル }),
                button({ text: "更新", class: styles.更新ボタン }).onClick(
                  () => void this._サービス.更新する(),
                )]),
            this._エラー表示,
            this._リスト,
            div({ class: styles.フッタリンク }).child(
                button({ text: "PC版で開く", class: styles.フッタリンクボタン }).onClick(
                  () => 表示モードを切り替える("desktop"),
                )),
            button({ class: styles.新規作成FAB })
                .child(追加アイコン(24, "currentColor"))
                .onClick(() => this._サービス.新規作成シートを開く())])
    );
  }
}
