import type Database from "better-sqlite3";
import { アイコンDataUrl } from "../domain/アイコンDataUrl.js";
import { エージェント名 } from "../domain/エージェント名.js";
import { キャラ } from "../domain/キャラ.js";
import { キャラ種別 } from "../domain/キャラ種別.js";
import { キャラプロンプト } from "../domain/キャラプロンプト.js";
import { 行動パターンメモ } from "../domain/行動パターンメモ.js";
import { キャラ行に絞る } from "./行検証.js";

// charasテーブル（ワークスペース直下の第一級エンティティ「キャラ」台帳）への
// 読み書きに責務を絞ったリポジトリ。作成者・作成時刻は初回登録時のまま保ち、
// 再登録（PUT）ではそれ以外の項目だけを上書きする
export class キャラリポジトリ {
  constructor(private readonly db: Database.Database) {}

  作成または更新する(
    名前: エージェント名,
    種別: キャラ種別,
    プロンプト: キャラプロンプト,
    アイコン: アイコンDataUrl,
    行動パターンメモ値: 行動パターンメモ,
    作成者: エージェント名,
  ): キャラ {
    const 現在時刻ISO = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO charas (name, type, prompt, icon_data_url, behavior_note, creator, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(name) DO UPDATE SET
           type = excluded.type,
           prompt = excluded.prompt,
           icon_data_url = excluded.icon_data_url,
           behavior_note = excluded.behavior_note,
           updated_at = excluded.updated_at`,
      )
      .run(
        名前.値,
        種別.値,
        プロンプト.値,
        アイコン.値,
        行動パターンメモ値.値,
        作成者.値,
        現在時刻ISO,
        現在時刻ISO,
      );
    const 行 = キャラ行に絞る(
      this.db
        .prepare(
          "SELECT name, type, prompt, icon_data_url, behavior_note, creator, created_at, updated_at FROM charas WHERE name = ?",
        )
        .get(名前.値),
    );
    return this._行から組み立てる(行);
  }

  削除する(名前: エージェント名): void {
    this.db.prepare("DELETE FROM charas WHERE name = ?").run(名前.値);
  }

  一覧を取得する(): キャラ[] {
    const 行一覧 = this.db
      .prepare(
        "SELECT name, type, prompt, icon_data_url, behavior_note, creator, created_at, updated_at FROM charas ORDER BY name ASC",
      )
      .all();
    return 行一覧.map((生行) => this._行から組み立てる(キャラ行に絞る(生行)));
  }

  private _行から組み立てる(行: {
    name: string;
    type: string;
    prompt: string;
    icon_data_url: string;
    behavior_note: string;
    creator: string;
    created_at: string;
    updated_at: string;
  }): キャラ {
    return キャラ.create({
      名前: エージェント名.create(行.name),
      種別: キャラ種別.create(行.type),
      プロンプト: キャラプロンプト.create(行.prompt),
      アイコン: アイコンDataUrl.create(行.icon_data_url),
      行動パターンメモ: 行動パターンメモ.create(行.behavior_note),
      作成者: エージェント名.create(行.creator),
      作成時刻ISO: 行.created_at,
      更新時刻ISO: 行.updated_at,
    });
  }
}
