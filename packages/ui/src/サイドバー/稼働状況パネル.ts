import { div, span, LV2HtmlComponentBase, type DivC } from "sengen-ui";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { 稼働状況一覧領域 } from "./稼働状況一覧領域";
import { 稼働状況行View } from "./稼働状況行View";
import { 状態表示ラベル } from "./状態表示ラベル";
import * as styles from "./style.css";

const 定期更新間隔ミリ秒 = 10_000;

// サイドバー下部の「稼働状況」節（LV2素部品）。誰が何をしているかを名前・状態バッジ・
// 現在の作業・札ID・最終更新の相対時刻で一覧表示する。ルーム選択に依存せず自律的に
// 定期更新する（ルーム一覧サイドバーと同じポーリングの流儀）。参照: DESIGN.md 11章 Phase B
export class 稼働状況パネル extends LV2HtmlComponentBase {
  protected _componentRoot: DivC;
  private readonly _一覧領域 = new 稼働状況一覧領域();
  private readonly _状態表示 = new 状態表示ラベル();

  constructor(private readonly _クライアント: Relayクライアント) {
    super();
    this._componentRoot = this._ルートを構築する(this._一覧領域, this._状態表示);
    void this.更新する();
    window.setInterval(() => void this.更新する(), 定期更新間隔ミリ秒);
  }

  async 更新する(): Promise<void> {
    try {
      const 一覧 = await this._クライアント.稼働一覧を取得する();
      this._一覧領域.全件を差し替える(一覧.map((表明) => new 稼働状況行View(表明)));
      this._状態表示.クリアする();
    } catch (エラー) {
      this._状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : "稼働状況の取得に失敗しました",
      );
    }
  }

  private _ルートを構築する(一覧領域: 稼働状況一覧領域, 状態表示: 状態表示ラベル): DivC {
    return (
      div({ class: styles.稼働状況ルート }).childs([
          div({ class: styles.メンバーヘッダ }).child(
              span({ text: "稼働状況", class: styles.メンバー見出し })),
          状態表示,
          一覧領域])
    );
  }
}
