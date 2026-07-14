import { キャラ一覧に稼働状況を合成する } from "../../キャラ/キャラ稼働合成";
import { キャラ合成に参加ルームを付与する } from "../../キャラ/キャラ参加ルーム合成";
import { 参加ルームマップを安全に取得する } from "../../キャラ/参加ルーム取得";
import type { キャラDTO } from "../../通信/キャラ型";
import type { Relayクライアント } from "../../通信/Relayクライアント";
import { 送信者名を読み込む } from "../../送信者名記憶";
import type { エラー表示ラベル } from "../エラー表示ラベル";
import type { ボトムシート } from "../ボトムシート";
import { キャラシート内容, type キャラ入力 } from "./キャラシート内容";
import { キャラ一覧領域 } from "./キャラ一覧領域";
import { キャラ項目行 } from "./キャラ項目行";

// キャラ一覧ビューのロジック層。キャラ+稼働状況(presence)のREST取得・合成・一覧反映と、
// 作成/更新/削除シートの開閉・API呼び出しを担う(ビュー本体は配線に徹する。
// デスクトップのキャラタブサービスと同じ役割分担)
export class キャラ一覧ビューサービス {
  constructor(
    private readonly _クライアント: Relayクライアント,
    private readonly _ボトムシート: ボトムシート,
    private readonly _リスト: キャラ一覧領域,
    private readonly _エラー表示: エラー表示ラベル,
  ) {}

  async 更新する(): Promise<void> {
    try {
      const [キャラ一覧, 稼働一覧] = await Promise.all([
        this._クライアント.キャラ一覧を取得する(),
        this._クライアント.稼働一覧を取得する(),
      ]);
      const 参加ルームマップ = await 参加ルームマップを安全に取得する(this._クライアント);
      const 合成一覧 = キャラ合成に参加ルームを付与する(
        キャラ一覧に稼働状況を合成する(キャラ一覧, 稼働一覧),
        参加ルームマップ,
      );
      this._リスト.全件を差し替える(
        合成一覧.map((合成) =>
          new キャラ項目行(合成).配線する({
            on選択: () => this.編集シートを開く(合成.キャラ),
          }),
        ),
      );
      this._エラー表示.クリアする();
    } catch (エラー) {
      this._エラー表示.表示する(
        エラー instanceof Error ? エラー.message : "キャラ一覧の取得に失敗しました",
      );
    }
  }

  新規作成シートを開く(): void {
    const 内容 = new キャラシート内容().配線する({
      on保存: (入力) => void this._保存する(内容, 入力),
      on削除: () => undefined,
    });
    this._ボトムシート.開く(内容);
  }

  編集シートを開く(キャラ: キャラDTO): void {
    const 内容 = new キャラシート内容(キャラ).配線する({
      on保存: (入力) => void this._保存する(内容, 入力),
      on削除: (名前) => void this._削除する(内容, 名前),
    });
    this._ボトムシート.開く(内容);
  }

  private async _保存する(内容: キャラシート内容, 入力: キャラ入力): Promise<void> {
    内容.保存中にする(true);
    try {
      await this._クライアント.キャラを登録する({
        名前: 入力.名前,
        種別: 入力.種別,
        作成者: 送信者名を読み込む(),
        プロンプト: 入力.プロンプト,
        アイコンdataUrl: 入力.アイコンdataUrl,
        行動パターンメモ: 入力.行動パターンメモ,
      });
      this._ボトムシート.閉じる();
      await this.更新する();
    } catch (エラー) {
      内容.エラーを表示する(
        エラー instanceof Error ? エラー.message : "キャラの保存に失敗しました",
      );
    } finally {
      内容.保存中にする(false);
    }
  }

  private async _削除する(内容: キャラシート内容, 名前: string): Promise<void> {
    try {
      await this._クライアント.キャラを削除する(名前);
      this._ボトムシート.閉じる();
      await this.更新する();
    } catch (エラー) {
      内容.エラーを表示する(
        エラー instanceof Error ? エラー.message : "キャラの削除に失敗しました",
      );
    }
  }
}
