import type Database from "better-sqlite3";
import { エージェント名 } from "../domain/エージェント名.js";
import { エージェント種別 } from "../domain/エージェント種別.js";
import { メンバー } from "../domain/メンバー.js";
import { ルームID } from "../domain/ルームID.js";
import { メンバー行に絞る } from "./行検証.js";

// membersテーブル（ルームのメンバー台帳）への読み書きに責務を絞ったリポジトリ
export class メンバーリポジトリ {
  constructor(private readonly db: Database.Database) {}

  登録する(ルーム: ルームID, 名前: エージェント名, 種別: エージェント種別): メンバー {
    // 冪等: 既存メンバーなら種別だけ更新し、参加時刻は初回登録時のまま保つ
    this.db
      .prepare(
        `INSERT INTO members (room_id, name, type, joined_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(room_id, name) DO UPDATE SET type = excluded.type`,
      )
      .run(ルーム.値, 名前.値, 種別.値, new Date().toISOString());
    const 行 = メンバー行に絞る(
      this.db
        .prepare("SELECT name, type, joined_at FROM members WHERE room_id = ? AND name = ?")
        .get(ルーム.値, 名前.値),
    );
    return メンバー.create({
      名前: エージェント名.create(行.name),
      種別: エージェント種別.create(行.type),
      参加時刻ISO: 行.joined_at,
    });
  }

  削除する(ルーム: ルームID, 名前: エージェント名): void {
    this.db
      .prepare("DELETE FROM members WHERE room_id = ? AND name = ?")
      .run(ルーム.値, 名前.値);
  }

  一覧を取得する(ルーム: ルームID): メンバー[] {
    const 行一覧 = this.db
      .prepare(
        "SELECT name, type, joined_at FROM members WHERE room_id = ? ORDER BY joined_at ASC, name ASC",
      )
      .all(ルーム.値);
    return 行一覧.map((生行) => {
      const 行 = メンバー行に絞る(生行);
      return メンバー.create({
        名前: エージェント名.create(行.name),
        種別: エージェント種別.create(行.type),
        参加時刻ISO: 行.joined_at,
      });
    });
  }
}
