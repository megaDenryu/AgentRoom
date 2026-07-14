import type Database from "better-sqlite3";
import { エージェント名 } from "../domain/エージェント名.js";
import { 参照札ID } from "../domain/参照札ID.js";
import { 現在の作業内容 } from "../domain/現在の作業内容.js";
import { 稼働状態 } from "../domain/稼働状態.js";
import { 稼働表明 } from "../domain/稼働表明.js";
import { 稼働表明行に絞る } from "./行検証.js";

// presenceテーブル（ワークスペース直下の稼働表明。ルーム所属にしない）への読み書きに
// 責務を絞ったリポジトリ。更新時刻は常にサーバー側の現在時刻で上書きする
export class 稼働表明リポジトリ {
  constructor(private readonly db: Database.Database) {}

  更新する(
    名前: エージェント名,
    状態: 稼働状態,
    現在の作業: 現在の作業内容,
    参照札: 参照札ID | null,
  ): 稼働表明 {
    this.db
      .prepare(
        `INSERT INTO presence (name, status, current_work, card_id, updated_at) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(name) DO UPDATE SET
           status = excluded.status,
           current_work = excluded.current_work,
           card_id = excluded.card_id,
           updated_at = excluded.updated_at`,
      )
      .run(名前.値, 状態.値, 現在の作業.値, 参照札?.値 ?? null, new Date().toISOString());
    const 行 = 稼働表明行に絞る(
      this.db.prepare("SELECT name, status, current_work, card_id, updated_at FROM presence WHERE name = ?").get(名前.値),
    );
    return this._行から組み立てる(行);
  }

  一覧を取得する(): 稼働表明[] {
    const 行一覧 = this.db
      .prepare("SELECT name, status, current_work, card_id, updated_at FROM presence ORDER BY name ASC")
      .all();
    return 行一覧.map((生行) => this._行から組み立てる(稼働表明行に絞る(生行)));
  }

  private _行から組み立てる(行: {
    name: string;
    status: string;
    current_work: string | null;
    card_id: number | null;
    updated_at: string;
  }): 稼働表明 {
    return 稼働表明.create({
      名前: エージェント名.create(行.name),
      状態: 稼働状態.create(行.status),
      現在の作業: 現在の作業内容.create(行.current_work),
      参照札: 参照札ID.create(行.card_id),
      更新時刻ISO: 行.updated_at,
    });
  }
}
