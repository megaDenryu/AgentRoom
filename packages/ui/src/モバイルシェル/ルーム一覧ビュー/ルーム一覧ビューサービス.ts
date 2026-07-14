import type { Relayクライアント } from "../../通信/Relayクライアント";
import { 送信者名を読み込む } from "../../送信者名記憶";
import type { エラー表示ラベル } from "../エラー表示ラベル";
import type { ボトムシート } from "../ボトムシート";
import { 新規ルームシート内容 } from "./新規ルームシート内容";
import type { ルーム一覧内容 } from "./ルーム一覧内容";
import { ルーム項目行 } from "./ルーム項目行";
import type { ルーム一覧領域 } from "./ルーム一覧領域";

// ルーム一覧ビューのロジック層。REST取得とリスト・エラー表示への反映、および
// ルーム作成シートの開閉とメンバー登録APIを担う(ビュー本体は配線に徹する。
// デスクトップのルーム一覧サイドバーサービスと同じ役割分担)
export class ルーム一覧ビューサービス {
  constructor(
    private readonly _クライアント: Relayクライアント,
    private readonly _ボトムシート: ボトムシート,
    private readonly _リスト: ルーム一覧領域,
    private readonly _エラー表示: エラー表示ラベル,
    private readonly _文言: ルーム一覧内容,
    private readonly _onルーム選択: (ルームID: string) => void,
  ) {}

  async 更新する(): Promise<void> {
    try {
      const 一覧 = await this._クライアント.ルーム一覧を取得する(送信者名を読み込む());
      this._リスト.全件を差し替える(
        一覧.map((概要) =>
          new ルーム項目行(概要, this._文言).配線する({
            on選択: () => this._onルーム選択(概要.ルームID),
          }),
        ),
      );
      this._エラー表示.クリアする();
    } catch (エラー) {
      this._エラー表示.表示する(エラー instanceof Error ? エラー.message : this._文言.一覧取得失敗);
    }
  }

  // 新規ルームシート内容はルームIDの文字種チェックを済ませた上でon作成を発火するため、
  // ここでの「作成」= 自分をそのルームにメンバー登録することだけを担う
  // (デスクトップのルーム一覧サイドバーサービスと同じ意味付け)
  新規作成シートを開く(): void {
    const 内容 = new 新規ルームシート内容(this._文言).配線する({
      on作成: (ルームID) => void this._ルームを作成する(内容, ルームID),
    });
    this._ボトムシート.開く(内容);
  }

  private async _ルームを作成する(
    内容: 新規ルームシート内容,
    ルームID: string,
  ): Promise<void> {
    内容.作成中にする(true);
    try {
      await this._クライアント.メンバーを登録する({
        ルームID,
        名前: 送信者名を読み込む(),
        種別: "human",
      });
      this._ボトムシート.閉じる();
      this._onルーム選択(ルームID);
      await this.更新する();
    } catch (エラー) {
      内容.エラーを表示する(エラー instanceof Error ? エラー.message : this._文言.作成失敗);
    } finally {
      内容.作成中にする(false);
    }
  }
}
