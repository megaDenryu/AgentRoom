import Database from "better-sqlite3";
import type { アイコンDataUrl } from "../domain/アイコンDataUrl.js";
import type { エージェント名 } from "../domain/エージェント名.js";
import type { エージェント種別 } from "../domain/エージェント種別.js";
import type { キャラ } from "../domain/キャラ.js";
import type { キャラ種別 } from "../domain/キャラ種別.js";
import type { キャラプロンプト } from "../domain/キャラプロンプト.js";
import type { メッセージ } from "../domain/メッセージ.js";
import type { メンバー } from "../domain/メンバー.js";
import type { ルームID } from "../domain/ルームID.js";
import type { ルーム概要 } from "../domain/ルーム概要.js";
import type { 参照札ID } from "../domain/参照札ID.js";
import type { 宛先 } from "../domain/宛先.js";
import type { 現在の作業内容 } from "../domain/現在の作業内容.js";
import type { 稼働状態 } from "../domain/稼働状態.js";
import type { 稼働表明 } from "../domain/稼働表明.js";
import type { 行動パターンメモ } from "../domain/行動パターンメモ.js";
import { データベースを初期化する } from "./データベース初期化.js";
import { キャラリポジトリ } from "./キャラリポジトリ.js";
import { 既読リポジトリ } from "./既読リポジトリ.js";
import { メッセージリポジトリ } from "./メッセージリポジトリ.js";
import { メンバーリポジトリ } from "./メンバーリポジトリ.js";
import { ルーム概要リポジトリ } from "./ルーム概要リポジトリ.js";
import { 稼働表明リポジトリ } from "./稼働表明リポジトリ.js";

// 永続化の窓口となるファサード。スキーマ初期化・マイグレーションを担い、
// 実際の読み書きは責務ごとのリポジトリ（メッセージ/メンバー/既読/ルーム概要/稼働表明）に委譲する
export class メッセージストア {
  private readonly メッセージ: メッセージリポジトリ;
  private readonly メンバー: メンバーリポジトリ;
  private readonly 既読: 既読リポジトリ;
  private readonly ルーム概要: ルーム概要リポジトリ;
  private readonly 稼働表明: 稼働表明リポジトリ;
  private readonly キャラ: キャラリポジトリ;

  private constructor(private readonly db: Database.Database) {
    this.メッセージ = new メッセージリポジトリ(db);
    this.メンバー = new メンバーリポジトリ(db);
    this.既読 = new 既読リポジトリ(db);
    this.ルーム概要 = new ルーム概要リポジトリ(db, this.既読);
    this.稼働表明 = new 稼働表明リポジトリ(db);
    this.キャラ = new キャラリポジトリ(db);
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

  稼働を更新する(
    名前: エージェント名,
    状態: 稼働状態,
    現在の作業: 現在の作業内容,
    参照札: 参照札ID | null,
  ): 稼働表明 {
    return this.稼働表明.更新する(名前, 状態, 現在の作業, 参照札);
  }

  稼働一覧を取得する(): 稼働表明[] {
    return this.稼働表明.一覧を取得する();
  }

  キャラを作成または更新する(
    名前: エージェント名,
    種別: キャラ種別,
    プロンプト: キャラプロンプト,
    アイコン: アイコンDataUrl,
    行動パターンメモ値: 行動パターンメモ,
    作成者: エージェント名,
  ): キャラ {
    return this.キャラ.作成または更新する(
      名前,
      種別,
      プロンプト,
      アイコン,
      行動パターンメモ値,
      作成者,
    );
  }

  キャラを削除する(名前: エージェント名): void {
    this.キャラ.削除する(名前);
  }

  キャラ一覧を取得する(): キャラ[] {
    return this.キャラ.一覧を取得する();
  }

  閉じる(): void {
    this.db.close();
  }
}
