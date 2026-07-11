import type { Relayクライアント } from "../通信/Relayクライアント";
import { 送信者名を読み込む } from "../送信者名記憶";
import { メンバー一覧領域 } from "./メンバー一覧領域";
import { メンバー項目View } from "./メンバー項目View";
import { メンバー見出しラベル } from "./メンバー見出しラベル";
import { ルーム一覧サイドバー部品 } from "./ルーム一覧サイドバー部品";
import { ルーム一覧領域 } from "./ルーム一覧領域";
import { ルーム項目View } from "./ルーム項目View";
import { 状態表示ラベル } from "./状態表示ラベル";

// ルーム一覧サイドバーのロジック層。ルーム一覧・メンバー台帳のAPI呼び出しと
// 選択中ルームの追跡を担い、サイドバー本体は配線に徹する
export class ルーム一覧サイドバーサービス {
  private _選択中ルームID: string | null = null;

  constructor(
    private readonly _クライアント: Relayクライアント,
    private readonly _部品: ルーム一覧サイドバー部品,
    private readonly _ルーム一覧: ルーム一覧領域,
    private readonly _メンバー一覧: メンバー一覧領域,
    private readonly _メンバー見出し: メンバー見出しラベル,
    private readonly _状態表示: 状態表示ラベル,
    private readonly _onルーム選択: (ルームID: string) => void,
    private readonly _onメンバー選択: (名前: string) => void,
  ) {}

  // アプリシェルがタブ選択に追従して呼ぶ。メンバーパネルの対象ルームが切り替わる
  選択ルームを設定する(ルームID: string | null): void {
    if (this._選択中ルームID === ルームID) return;
    this._選択中ルームID = ルームID;
    this._メンバー見出し.ルームを表示する(ルームID);
    if (ルームID === null) {
      this._メンバー一覧.未選択を表示する();
      return;
    }
    void this._メンバー一覧を更新する();
  }

  async 更新する(): Promise<void> {
    try {
      const 一覧 = await this._クライアント.ルーム一覧を取得する(送信者名を読み込む());
      this._ルーム一覧.全件を差し替える(
        一覧.map((概要) =>
          new ルーム項目View(概要).配線する({
            on選択: () => this._onルーム選択(概要.ルームID),
          }),
        ),
      );
      await this._メンバー一覧を更新する();
      this._状態表示.クリアする();
    } catch (エラー) {
      this._状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : "ルーム一覧の取得に失敗しました",
      );
    }
  }

  // ルーム作成 = 自分（現在の送信者名・種別human）をそのルームにメンバー登録する
  async ルームを作成する(ルームID: string): Promise<void> {
    try {
      await this._クライアント.メンバーを登録する({
        ルームID,
        名前: 送信者名を読み込む(),
        種別: "human",
      });
      this._部品.新規ルームフォーム.クリアする();
      this._状態表示.クリアする();
      this._onルーム選択(ルームID);
      await this.更新する();
    } catch (エラー) {
      this._状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : "ルームの作成に失敗しました",
      );
    }
  }

  async メンバーを追加する(名前: string, 種別: string): Promise<void> {
    if (this._選択中ルームID === null) {
      this._状態表示.エラーを表示する("先にルームを選択してください");
      return;
    }
    try {
      await this._クライアント.メンバーを登録する({
        ルームID: this._選択中ルームID,
        名前,
        種別,
      });
      this._部品.メンバー追加フォーム.クリアする();
      this._状態表示.クリアする();
      await this._メンバー一覧を更新する();
    } catch (エラー) {
      this._状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : "メンバー追加に失敗しました",
      );
    }
  }

  async メンバーを削除する(名前: string): Promise<void> {
    if (this._選択中ルームID === null) return;
    try {
      await this._クライアント.メンバーを削除する({
        ルームID: this._選択中ルームID,
        名前,
      });
      this._状態表示.クリアする();
      await this._メンバー一覧を更新する();
    } catch (エラー) {
      this._状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : "メンバー削除に失敗しました",
      );
    }
  }

  private async _メンバー一覧を更新する(): Promise<void> {
    if (this._選択中ルームID === null) return;
    const メンバー = await this._クライアント.メンバー一覧を取得する(this._選択中ルームID);
    this._メンバー一覧.全件を差し替える(
      メンバー.map((一人) =>
        new メンバー項目View(一人).配線する({
          on選択: () => this._onメンバー選択(一人.名前),
          on削除: () => void this.メンバーを削除する(一人.名前),
        }),
      ),
    );
  }
}
