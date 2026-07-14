import { キャラ一覧に稼働状況を合成する } from "../キャラ/キャラ稼働合成";
import { キャラ合成に参加ルームを付与する } from "../キャラ/キャラ参加ルーム合成";
import { 参加ルームマップを安全に取得する } from "../キャラ/参加ルーム取得";
import type { キャラDTO } from "../通信/キャラ型";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { 送信者名を読み込む } from "../送信者名記憶";
import type { キャラタブ内容 } from "./キャラタブ内容";
import type { キャラ入力 } from "./キャラフォーム";
import { キャラ項目View } from "./キャラ項目View";
import type { キャラタブ部品 } from "./キャラタブ部品";

// キャラタブのロジック層。キャラ一覧+稼働状況(presence)のREST取得・合成・一覧反映と、
// 作成/更新/削除のAPI呼び出しを担う(本体は配線に徹する)。presenceは定期ポーリングせず、
// タブを開いたとき・作成/更新/削除の直後・手動更新ボタンでのみ取得する
// (タブは閉じても部品集約インスタンスが解放されない現状の外殻レイアウトの都合上、
// setIntervalを使うとタブの開閉を繰り返すたびタイマーがリークするため避けている)
export class キャラタブサービス {
  private _編集中の名前: string | null = null;

  private constructor(
    private readonly _クライアント: Relayクライアント,
    private readonly _部品: キャラタブ部品,
    private readonly _文言: キャラタブ内容,
  ) {}

  static 作る(依存: {
    クライアント: Relayクライアント;
    部品: キャラタブ部品;
    文言: キャラタブ内容;
  }): キャラタブサービス {
    return new キャラタブサービス(依存.クライアント, 依存.部品, 依存.文言);
  }

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
      this._部品.一覧領域.全件を差し替える(
        合成一覧.map((合成) =>
          new キャラ項目View(合成, this._文言).配線する({
            on編集: () => this._編集を開始する(合成.キャラ),
            on削除: () => void this.削除する(合成.キャラ.名前),
          }),
        ),
      );
      this._部品.状態表示.クリアする();
    } catch (エラー) {
      this._部品.状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : this._文言.一覧取得失敗,
      );
    }
  }

  async 保存する(入力: キャラ入力): Promise<void> {
    try {
      await this._クライアント.キャラを登録する({
        名前: 入力.名前,
        種別: 入力.種別,
        作成者: 送信者名を読み込む(),
        プロンプト: 入力.プロンプト,
        アイコンdataUrl: 入力.アイコンdataUrl,
        行動パターンメモ: 入力.行動パターンメモ,
      });
      this._部品.フォーム.クリアする();
      this._編集中の名前 = null;
      this._部品.状態表示.クリアする();
      await this.更新する();
    } catch (エラー) {
      this._部品.状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : this._文言.保存失敗,
      );
    }
  }

  編集をキャンセルする(): void {
    this._編集中の名前 = null;
  }

  async 削除する(名前: string): Promise<void> {
    try {
      await this._クライアント.キャラを削除する(名前);
      if (this._編集中の名前 === 名前) {
        this._部品.フォーム.クリアする();
        this._編集中の名前 = null;
      }
      this._部品.状態表示.クリアする();
      await this.更新する();
    } catch (エラー) {
      this._部品.状態表示.エラーを表示する(
        エラー instanceof Error ? エラー.message : this._文言.削除失敗,
      );
    }
  }

  private _編集を開始する(キャラ: キャラDTO): void {
    this._編集中の名前 = キャラ.名前;
    this._部品.フォーム.編集内容を設定する(キャラ);
  }
}
