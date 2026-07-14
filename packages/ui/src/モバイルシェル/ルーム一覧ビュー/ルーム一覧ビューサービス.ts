import type { Relayクライアント } from "../../通信/Relayクライアント";
import { 送信者名を読み込む } from "../../送信者名記憶";
import type { エラー表示ラベル } from "../エラー表示ラベル";
import { ルーム項目行 } from "./ルーム項目行";
import type { ルーム一覧領域 } from "./ルーム一覧領域";

// ルーム一覧ビューのロジック層。REST取得とリスト・エラー表示への反映を担い、
// ビュー本体は配線に徹する(デスクトップのルーム一覧サイドバーサービスと同じ役割分担)
export class ルーム一覧ビューサービス {
  constructor(
    private readonly _クライアント: Relayクライアント,
    private readonly _リスト: ルーム一覧領域,
    private readonly _エラー表示: エラー表示ラベル,
    private readonly _onルーム選択: (ルームID: string) => void,
  ) {}

  async 更新する(): Promise<void> {
    try {
      const 一覧 = await this._クライアント.ルーム一覧を取得する(送信者名を読み込む());
      this._リスト.全件を差し替える(
        一覧.map((概要) =>
          new ルーム項目行(概要).配線する({
            on選択: () => this._onルーム選択(概要.ルームID),
          }),
        ),
      );
      this._エラー表示.クリアする();
    } catch (エラー) {
      this._エラー表示.表示する(
        エラー instanceof Error ? エラー.message : "ルーム一覧の取得に失敗しました",
      );
    }
  }
}
