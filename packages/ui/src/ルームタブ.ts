import {
  button,
  div,
  span,
  textarea,
  textInput,
  LV2HtmlComponentBase,
  type ButtonC,
  type DivC,
  type SpanC,
  type TextAreaC,
  type TextInputC,
} from "sengen-ui";
import * as styles from "./ルームタブ.css";
import type { メッセージDTO } from "./通信/メッセージ型";
import type { Relayクライアント } from "./通信/Relayクライアント";
import { ルーム接続, type 接続状態 } from "./通信/ルーム接続";
import { 送信者色を割り当てる } from "./送信者配色";
import { 送信者名を読み込む, 送信者名を保存する } from "./送信者名記憶";

// 最下部からこの距離以内なら「最下部にいる」とみなして自動追従を続ける
const 最下部判定しきい値px = 48;

function 時刻表示(送信時刻ISO: string): string {
  const 日時 = new Date(送信時刻ISO);
  if (Number.isNaN(日時.getTime())) return 送信時刻ISO;
  return 日時.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function メッセージView(メッセージ: メッセージDTO): DivC {
  const 色 = 送信者色を割り当てる(メッセージ.送信者);
  return div({ class: styles.メッセージ行 })
    .setCssVariable("--sender-color", 色)
    .childs([
      div({ class: styles.メッセージヘッダ }).childs([
        span({ text: メッセージ.送信者, class: styles.送信者ラベル }),
        span({ text: 時刻表示(メッセージ.送信時刻), class: styles.時刻ラベル }),
      ]),
      div({ text: メッセージ.本文, class: styles.本文 }),
    ]);
}

// 1ルーム分の会話タイムラインタブ。WSでバックログ+リアルタイム受信し、
// 下部の入力欄から人間がPOSTで発言できる
export class ルームタブ extends LV2HtmlComponentBase {
  protected _componentRoot: DivC;
  private readonly _接続バナー: DivC;
  private readonly _タイムライン: DivC;
  private readonly _新着ジャンプボタン: ButtonC;
  private readonly _送信者名入力: TextInputC;
  private readonly _本文入力: TextAreaC;
  private readonly _送信ボタン: ButtonC;
  private readonly _送信エラー表示: SpanC;
  private readonly _接続: ルーム接続;
  private _自動追従中 = true;
  private _未読件数 = 0;

  constructor(
    private readonly _ルームID: string,
    private readonly _クライアント: Relayクライアント,
  ) {
    super();

    this._接続バナー = div({ class: styles.接続バナー }).setAttribute(
      "data-connection",
      "接続試行中",
    );
    this._タイムライン = div({ class: styles.タイムライン }).onScroll(() =>
      this._スクロール位置から追従状態を更新する(),
    );
    this._新着ジャンプボタン = button({
      text: "最下部へ",
      class: styles.新着ジャンプボタン,
    })
      .setAttribute("data-visible", "false")
      .onClick(() => this._最下部へ移動する());
    this._送信者名入力 = textInput({
      value: 送信者名を読み込む(),
      placeholder: "送信者名",
      class: styles.送信者名入力,
    }).onChange(() => 送信者名を保存する(this._送信者名入力.getValue().trim()));
    this._本文入力 = textarea({
      rows: 2,
      placeholder: "メッセージを入力（Ctrl+Enterで送信）",
      class: styles.本文入力,
    });
    this._本文入力.addTextAreaEventListener("keydown", (イベント) => {
      if (イベント.key === "Enter" && (イベント.ctrlKey || イベント.metaKey)) {
        イベント.preventDefault();
        void this._送信する();
      }
    });
    this._送信ボタン = button({ text: "送信", class: styles.送信ボタン }).onClick(
      () => void this._送信する(),
    );
    this._送信エラー表示 = span({ class: styles.送信エラー表示 });

    this._componentRoot = div({ class: styles.ルート }).childs([
      this._接続バナー,
      div({ class: styles.タイムライン枠 }).childs([
        this._タイムライン,
        this._新着ジャンプボタン,
      ]),
      div({ class: styles.入力欄 }).childs([
        this._送信者名入力,
        this._本文入力,
        this._送信ボタン,
        this._送信エラー表示,
      ]),
    ]);

    this._接続 = new ルーム接続(this._ルームID, {
      on新着: (メッセージ) => this._新着を反映する(メッセージ),
      on状態変化: (状態) => this._接続状態を反映する(状態),
    });
    this._接続.開始する();
  }

  dispose(): void {
    this._接続.破棄する();
  }

  private _新着を反映する(メッセージ: メッセージDTO): void {
    this._タイムライン.child(メッセージView(メッセージ));
    if (this._自動追従中) {
      this._タイムライン.scrollToBottom();
      return;
    }
    this._未読件数 += 1;
    this._新着ジャンプボタン
      .setTextContent(`新着${this._未読件数}件`)
      .setAttribute("data-visible", "true");
  }

  private _接続状態を反映する(状態: 接続状態): void {
    this._接続バナー.setAttribute("data-connection", 状態.種別);
    switch (状態.種別) {
      case "接続済み":
        break;
      case "接続試行中":
        this._接続バナー.setTextContent("サーバーに接続しています...");
        break;
      case "再接続待ち":
        this._接続バナー.setTextContent(
          `切断されました。${Math.round(状態.待機ミリ秒 / 1000)}秒後に再接続します`,
        );
        break;
    }
  }

  // スクロール位置の読み取りはSengenUIにAPIが無いため、element参照経由の最小限の読み取りに留める
  private _最下部にいるか(): boolean {
    const 要素 = this._タイムライン.dom.element;
    return 要素.scrollHeight - 要素.scrollTop - 要素.clientHeight < 最下部判定しきい値px;
  }

  private _スクロール位置から追従状態を更新する(): void {
    if (this._最下部にいるか()) {
      this._自動追従を再開する();
    } else {
      this._自動追従中 = false;
    }
  }

  private _最下部へ移動する(): void {
    this._タイムライン.scrollToBottom();
    this._自動追従を再開する();
  }

  private _自動追従を再開する(): void {
    this._自動追従中 = true;
    this._未読件数 = 0;
    this._新着ジャンプボタン.setAttribute("data-visible", "false");
  }

  private async _送信する(): Promise<void> {
    const 送信者 = this._送信者名入力.getValue().trim();
    const 本文 = this._本文入力.getValue().trim();
    if (本文.length === 0) return;
    if (送信者.length === 0) {
      this._送信エラー表示.setTextContent("送信者名を入力してください");
      return;
    }

    this._送信ボタン.setDisabled(true);
    try {
      await this._クライアント.メッセージを送信する({
        ルームID: this._ルームID,
        送信者,
        本文,
      });
      this._本文入力.setValue("");
      this._送信エラー表示.setTextContent("");
      送信者名を保存する(送信者);
      // 自分の発言はWS経由で戻ってくるので、追従を再開して到着時に最下部へ流す
      this._自動追従を再開する();
      this._タイムライン.scrollToBottom();
    } catch (エラー) {
      this._送信エラー表示.setTextContent(
        エラー instanceof Error ? エラー.message : "送信に失敗しました",
      );
    } finally {
      this._送信ボタン.setDisabled(false);
    }
  }
}
