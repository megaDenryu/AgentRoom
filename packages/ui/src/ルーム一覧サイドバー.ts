import {
  button,
  div,
  span,
  LV2HtmlComponentBase,
  type DivC,
} from "sengen-ui";
import * as styles from "./ルーム一覧サイドバー.css";
import type { ルーム概要DTO } from "./通信/メッセージ型";
import type { Relayクライアント } from "./通信/Relayクライアント";

const 定期更新間隔ミリ秒 = 10_000;

function 最終送信時刻表示(最終送信時刻ISO: string): string {
  const 日時 = new Date(最終送信時刻ISO);
  if (Number.isNaN(日時.getTime())) return 最終送信時刻ISO;
  return 日時.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ルーム項目View(概要: ルーム概要DTO, on選択: () => void): DivC {
  return div({ class: styles.ルーム項目 })
    .childs([
      div({ text: 概要.ルームID, class: styles.ルーム名 }),
      div({
        text: `${概要.メッセージ数}件 / 最終 ${最終送信時刻表示(概要.最終送信時刻)}`,
        class: styles.ルームメタ,
      }),
    ])
    .onClick(on選択);
}

// 右サイドバーのルーム一覧。定期更新+手動更新でGET /api/roomsを取得し、
// クリックでそのルームのタブを開くようアプリシェルへ通知する
export class ルーム一覧サイドバー extends LV2HtmlComponentBase {
  protected _componentRoot: DivC;
  private readonly _状態表示: DivC;
  private readonly _一覧領域: DivC;
  private _onルーム選択: ((ルームID: string) => void) | null = null;

  constructor(private readonly _クライアント: Relayクライアント) {
    super();
    this._状態表示 = div({ class: styles.状態表示 });
    this._一覧領域 = div({ class: styles.一覧領域 });
    this._componentRoot = div({ class: styles.ルート }).childs([
      div({ class: styles.ヘッダ }).childs([
        span({ text: "ルーム一覧", class: styles.タイトル }),
        button({ text: "更新", class: styles.更新ボタン }).onClick(
          () => void this.更新する(),
        ),
      ]),
      this._状態表示,
      this._一覧領域,
    ]);

    void this.更新する();
    // サイドバーはアプリと同寿命なのでタイマーの解除は不要
    window.setInterval(() => void this.更新する(), 定期更新間隔ミリ秒);
  }

  onルーム選択(コールバック: (ルームID: string) => void): void {
    this._onルーム選択 = コールバック;
  }

  async 更新する(): Promise<void> {
    try {
      const 一覧 = await this._クライアント.ルーム一覧を取得する();
      this._一覧領域.clearChildren();
      if (一覧.length === 0) {
        this._一覧領域.child(
          div({ text: "ルームはまだありません", class: styles.空表示 }),
        );
      } else {
        this._一覧領域.childs(
          一覧.map((概要) =>
            ルーム項目View(概要, () => this._onルーム選択?.(概要.ルームID)),
          ),
        );
      }
      this._状態表示.setTextContent("");
    } catch (エラー) {
      this._状態表示.setTextContent(
        エラー instanceof Error ? エラー.message : "ルーム一覧の取得に失敗しました",
      );
    }
  }
}
