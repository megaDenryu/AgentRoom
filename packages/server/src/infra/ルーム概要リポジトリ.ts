import type Database from "better-sqlite3";
import { エージェント名 } from "../domain/エージェント名.js";
import { ルームID } from "../domain/ルームID.js";
import type { ルーム概要 } from "../domain/ルーム概要.js";
import { ルーム概要行に絞る } from "./行検証.js";
import type { 既読リポジトリ } from "./既読リポジトリ.js";

// ルーム一覧の集計クエリに責務を絞ったリポジトリ。未読数の算出は既読リポジトリに委譲する
export class ルーム概要リポジトリ {
  constructor(
    private readonly db: Database.Database,
    private readonly 既読: 既読リポジトリ,
  ) {}

  // 「メッセージのあるルーム ∪ メンバーのいるルーム」の和集合。
  // メンバー登録だけでメッセージ0のルームは 件数0・最終連番0 で載り、
  // 最終送信時刻は最新メンバーの参加時刻で代用する（一覧の並び順を成立させるため）
  一覧を取得する(読者: エージェント名 | null): ルーム概要[] {
    const 行一覧 = this.db
      .prepare(
        `SELECT
           r.room_id AS room_id,
           COALESCE(m.message_count, 0) AS message_count,
           COALESCE(m.last_seq, 0) AS last_seq,
           COALESCE(m.last_sent_at, b.last_joined_at) AS last_sent_at
         FROM (SELECT room_id FROM messages UNION SELECT room_id FROM members) r
         LEFT JOIN (
           SELECT room_id, COUNT(*) AS message_count, MAX(seq) AS last_seq, MAX(sent_at) AS last_sent_at
           FROM messages GROUP BY room_id
         ) m ON m.room_id = r.room_id
         LEFT JOIN (
           SELECT room_id, MAX(joined_at) AS last_joined_at
           FROM members GROUP BY room_id
         ) b ON b.room_id = r.room_id
         ORDER BY last_sent_at DESC`,
      )
      .all();
    return 行一覧.map((生行) => {
      const 行 = ルーム概要行に絞る(生行);
      return {
        ルームID: 行.room_id,
        メッセージ数: 行.message_count,
        最終連番: 行.last_seq,
        最終送信時刻: 行.last_sent_at,
        未読数:
          読者 === null ? 0 : this.既読.未読数を数える(ルームID.create(行.room_id), 読者),
      };
    });
  }
}
