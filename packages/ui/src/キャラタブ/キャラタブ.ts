import { button, div, span, LV2部品集約Base, type DivC } from "sengen-ui";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { キャラタブサービス } from "./キャラタブサービス";
import { キャラタブ部品 } from "./キャラタブ部品";
import * as styles from "./style.css";

// キャラ(人物)台帳を管理するデスクトップタブ(LV2部品集約)。左=一覧(presence合成表示)、
// 右=作成・編集フォームの2カラム構成。アプリシェルのアクティビティバー「キャラ」アイコンから
// 固定タブとして開く(札場タブと同じ単一インスタンス方式。アプリシェルサービス参照)
export class キャラタブ extends LV2部品集約Base<キャラタブ部品, キャラタブサービス> {
  protected _componentRoot: DivC;
  private readonly _部品: キャラタブ部品;
  private readonly _サービス: キャラタブサービス;

  constructor(クライアント: Relayクライアント) {
    super();
    this._部品 = キャラタブ部品.作る();
    this._サービス = キャラタブサービス.作る({ クライアント, 部品: this._部品 });
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
    void this._サービス.更新する();
  }

  protected _ルートを構築する(部品: キャラタブ部品, サービス: キャラタブサービス): DivC {
    return (
      div({ class: styles.ルート }).childs([
          div({ class: styles.一覧側 }).childs([
              div({ class: styles.ヘッダ }).childs([
                  span({ text: "キャラ一覧", class: styles.タイトル }),
                  button({ text: "更新", class: styles.更新ボタン }).onClick(
                    () => void サービス.更新する(),
                  )]),
              部品.状態表示,
              部品.一覧領域]),
          部品.フォーム.配線する({
              on保存: (入力) => void サービス.保存する(入力),
              onキャンセル: () => サービス.編集をキャンセルする(),
          })])
    );
  }
}
