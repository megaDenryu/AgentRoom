import Database from "better-sqlite3";
import type { エージェント名 } from "../domain/エージェント名.js";
import type { エージェント種別 } from "../domain/エージェント種別.js";
import type { メッセージ } from "../domain/メッセージ.js";
import type { メンバー } from "../domain/メンバー.js";
import type { ルームID } from "../domain/ルームID.js";
import type { ルーム概要 } from "../domain/ルーム概要.js";
import type { 宛先 } from "../domain/宛先.js";
import { データベースを初期化する } from "./データベース初期化.js";
import { 既読リポジトリ } from "./既読リポジトリ.js";
import { メッセージリポジトリ } from "./メッセージリポジトリ.js";
import { メンバーリポジトリ } from "./メンバーリポジトリ.js";
import { ルーム概要リポジトリ } from "./ルーム概要リポジトリ.js";

// 永続化の窓口となるファサード。スキーマ初期化・マイグレーションを担い、
// 実際の読み書きは責務ごとのリポジトリ（メッセージ/メンバー/既読/ルーム概要）に委譲する
export class メッセージストア {
  private readonly メッセージ: メッセージリポジトリ;
  private readonly メンバー: メンバーリポジトリ;
  private readonly 既読: 既読リポジトリ;
  private readonly ルーム概要: ルーム概要リポジトリ;

  private constructor(private readonly db: Database.Database) {
    this.メッセージ = new メッセージリポジトリ(db);
    this.メンバー = new メンバーリポジトリ(db);
    this.既読 = new 既読リポジトリ(db);
    this.ルーム概要 = new ルーム概要リポジトリ(db, this.既読);
  }

  static ファイルから開く(パス: string): メッセージストア {
    return メッセージストア.初期化(new Database(パス));
  }

  static メモリ上に作る(): メッセージストア {
    return メッセージストア.初期化(new Database(":memory:"));
  }

  private static 初期化(db: Database.Database): メッセージストア {
    データベースを初期化する(db);
    return new メッセージストア(db);
  }

  追加する(
    ルーム: ルームID,
    送信者: エージェント名,
    本文: string,
    メッセージ宛先?: 宛先,
  ): メッセージ {
    return this.メッセージ.追加する(ルーム, 送信者, 本文, メッセージ宛先);
  }

  以降を取得する(ルーム: ルームID, 基準連番: number, 上限: number): メッセージ[] {
    return this.メッセージ.以降を取得する(ルーム, 基準連番, 上限);
  }

  最終連番を取得する(ルーム: ルームID): number {
    return this.メッセージ.最終連番を取得する(ルーム);
  }

  ルーム一覧を取得する(読者: エージェント名 | null = null): ルーム概要[] {
    return this.ルーム概要.一覧を取得する(読者);
  }

  メンバーを登録する(
    ルーム: ルームID,
    名前: エージェント名,
    種別: エージェント種別,
  ): メンバー {
    return this.メンバー.登録する(ルーム, 名前, 種別);
  }

  メンバーを削除する(ルーム: ルームID, 名前: エージェント名): void {
    this.メンバー.削除する(ルーム, 名前);
  }

  メンバー一覧を取得する(ルーム: ルームID): メンバー[] {
    return this.メンバー.一覧を取得する(ルーム);
  }

  既読位置を進める(ルーム: ルームID, 読者: エージェント名, 連番: number): number {
    return this.既読.進める(ルーム, 読者, 連番);
  }

  既読位置を取得する(ルーム: ルームID, 読者: エージェント名): number {
    return this.既読.取得する(ルーム, 読者);
  }

  未読数を数える(ルーム: ルームID, 読者: エージェント名): number {
    return this.既読.未読数を数える(ルーム, 読者);
  }

  閉じる(): void {
    this.db.close();
  }
}
