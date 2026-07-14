import { button, div, span, LV2HtmlComponentBase, type DivC } from "sengen-ui";
import type { Relayクライアント } from "../../通信/Relayクライアント";
import { 追加アイコン } from "../../アイコン";
import { 現在ロケールを取得する } from "../../文言/現在ロケール";
import { エラー表示ラベル } from "../エラー表示ラベル";
import * as 共有styles from "../style.css";
import { 画面表示状態 } from "../状態";
import type { ボトムシート } from "../ボトムシート";
import { キャラ一覧内容を取得する } from "./キャラ一覧内容";
import { キャラ一覧ビューサービス } from "./キャラ一覧ビューサービス";
import { キャラ一覧領域 } from "./キャラ一覧領域";
import * as styles from "./style.css";

// 単一フルスクリーンビューの1つ「キャラ一覧」(LV2素部品)。presence合成表示の一覧+
// 作成/編集/削除をボトムシートで行う(ルーム一覧ビューと同型。他画面への遷移を持たない
// 自己完結ビューのため、上方向イベントの配線は不要)
export class キャラ一覧ビュー extends LV2HtmlComponentBase {
  protected _componentRoot: DivC;
  private readonly _文言 = キャラ一覧内容を取得する(現在ロケールを取得する());
  private readonly _リスト = new キャラ一覧領域(this._文言);
  private readonly _エラー表示 = new エラー表示ラベル();
  private readonly _サービス: キャラ一覧ビューサービス;

  constructor(クライアント: Relayクライアント, ボトムシート: ボトムシート) {
    super();
    this._サービス = new キャラ一覧ビューサービス(
      クライアント,
      ボトムシート,
      this._リスト,
      this._エラー表示,
      this._文言,
    );
    this._componentRoot = this._ルートを構築する();
  }

  更新する(): Promise<void> {
    return this._サービス.更新する();
  }

  private _ルートを構築する(): DivC {
    return (
      div({ class: [共有styles.画面, styles.ルート] })
        .setAttribute(画面表示状態.attribute, 画面表示状態.value.非表示)
        .childs([
            div({ class: styles.ヘッダ }).childs([
                span({ text: this._文言.タイトル, class: styles.タイトル }),
                button({ text: this._文言.更新ボタン, class: styles.更新ボタン }).onClick(
                  () => void this._サービス.更新する(),
                )]),
            this._エラー表示,
            this._リスト,
            button({ class: styles.新規作成FAB })
                .child(追加アイコン(24, "currentColor"))
                .onClick(() => this._サービス.新規作成シートを開く())])
    );
  }
}
