import type Database from "better-sqlite3";
import { 文書概要 } from "../domain/文書概要.js";
import { 文書索引エントリ } from "../domain/文書索引エントリ.js";
import { 文書パス } from "../domain/文書パス.js";
import { 文書リポジトリ名 } from "../domain/文書リポジトリ名.js";
import { 文書タイトル } from "../domain/文書タイトル.js";
import { 文書索引行に絞る } from "./行検証.js";

// documentsテーブル(仕様書・成果物mdの索引台帳)への読み書きに責務を絞ったリポジトリ。
// 自然キーは(repository, path)の組。同じ組の再登録は上書きになり、登録時刻は初回登録時の
// まま保つ(キャラリポジトリのcreated_at/updated_atと同じ方針)
export class 文書索引リポジトリ {
  constructor(private readonly db: Database.Database) {}

  登録または更新する(
    リポジトリ: 文書リポジトリ名,
    パス: 文書パス,
    タイトル: 文書タイトル,
    概要: 文書概要,
  ): 文書索引エントリ {
    const 現在時刻ISO = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO documents (repository, path, title, summary, registered_at, indexed_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(repository, path) DO UPDATE SET
           title = excluded.title,
           summary = excluded.summary,
           indexed_at = excluded.indexed_at`,
      )
      .run(リポジトリ.値, パス.値, タイトル.値, 概要.値, 現在時刻ISO, 現在時刻ISO);
    const 行 = 文書索引行に絞る(
      this.db
        .prepare(
          "SELECT id, repository, path, title, summary, registered_at, indexed_at FROM documents WHERE repository = ? AND path = ?",
        )
        .get(リポジトリ.値, パス.値),
    );
    return this._行から組み立てる(行);
  }

  一覧を取得する(): 文書索引エントリ[] {
    const 行一覧 = this.db
      .prepare(
        "SELECT id, repository, path, title, summary, registered_at, indexed_at FROM documents ORDER BY repository ASC, path ASC",
      )
      .all();
    return 行一覧.map((生行) => this._行から組み立てる(文書索引行に絞る(生行)));
  }

  private _行から組み立てる(行: {
    id: number;
    repository: string;
    path: string;
    title: string;
    summary: string | null;
    registered_at: string;
    indexed_at: string;
  }): 文書索引エントリ {
    return 文書索引エントリ.create({
      ID: 行.id,
      リポジトリ: 文書リポジトリ名.create(行.repository),
      パス: 文書パス.create(行.path),
      タイトル: 文書タイトル.create(行.title),
      概要: 文書概要.create(行.summary),
      登録時刻ISO: 行.registered_at,
      最終索引時刻ISO: 行.indexed_at,
    });
  }
}
