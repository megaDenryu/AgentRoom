import type Database from "better-sqlite3";
import { エージェント名 } from "../domain/エージェント名.js";
import { ルームID } from "../domain/ルームID.js";
import { 検証エラー } from "../domain/検証エラー.js";
import { 件数行に絞る, 既読位置行に絞る } from "./行検証.js";

// read_positionsテーブルへの読み書きと、それを基にした未読数算出に責務を絞ったリポジトリ
export class 既読リポジトリ {
  constructor(private readonly db: Database.Database) {}

  // 既読位置は前進のみ。現在値より小さい連番を渡されても巻き戻さない（戻すと未読数が
  // 増えて見え、UI・エージェント双方の「読んだ」判断が信用できなくなる）
  進める(ルーム: ルームID, 読者: エージェント名, 連番: number): number {
    if (!Number.isInteger(連番) || 連番 < 0) {
      throw new 検証エラー(`既読位置の連番は0以上の整数である必要があります: ${連番}`);
    }
    this.db
      .prepare(
        `INSERT INTO read_positions (room_id, reader, last_read_seq, updated_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(room_id, reader) DO UPDATE SET
           last_read_seq = MAX(last_read_seq, excluded.last_read_seq),
           updated_at = excluded.updated_at`,
      )
      .run(ルーム.値, 読者.値, 連番, new Date().toISOString());
    return this.取得する(ルーム, 読者);
  }

  取得する(ルーム: ルームID, 読者: エージェント名): number {
    const 行 = this.db
      .prepare(
        "SELECT last_read_seq FROM read_positions WHERE room_id = ? AND reader = ?",
      )
      .get(ルーム.値, 読者.値);
    return 既読位置行に絞る(行);
  }

  // 未読 = 既読位置より後 かつ 自分の発言でない かつ 自分に届くもの（全員宛 or 自分宛）
  未読数を数える(ルーム: ルームID, 読者: エージェント名): number {
    const 既読位置 = this.取得する(ルーム, 読者);
    const 行 = this.db
      .prepare(
        `SELECT COUNT(*) AS count FROM messages
         WHERE room_id = ? AND seq > ? AND sender != ? AND (to_agent IS NULL OR to_agent = ?)`,
      )
      .get(ルーム.値, 既読位置, 読者.値, 読者.値);
    return 件数行に絞る(行);
  }
}
