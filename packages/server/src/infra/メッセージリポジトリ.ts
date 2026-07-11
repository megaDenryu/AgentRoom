import type Database from "better-sqlite3";
import { エージェント名 } from "../domain/エージェント名.js";
import { メッセージ } from "../domain/メッセージ.js";
import { ルームID } from "../domain/ルームID.js";
import { type 宛先, 全員宛, 宛先をDTO値にする, 宛先をDTO値から作る } from "../domain/宛先.js";
import { 検証エラー } from "../domain/検証エラー.js";
import { メッセージ行に絞る, 最終連番行に絞る } from "./行検証.js";

// messagesテーブルへの読み書きに責務を絞ったリポジトリ
export class メッセージリポジトリ {
  constructor(private readonly db: Database.Database) {}

  追加する(
    ルーム: ルームID,
    送信者: エージェント名,
    本文: string,
    メッセージ宛先: 宛先 = 全員宛,
  ): メッセージ {
    if (本文.length === 0) {
      throw new 検証エラー("本文が空のメッセージは追加できません");
    }
    const 送信時刻ISO = new Date().toISOString();
    const 結果 = this.db
      .prepare(
        "INSERT INTO messages (room_id, sender, body, sent_at, to_agent) VALUES (?, ?, ?, ?, ?)",
      )
      .run(ルーム.値, 送信者.値, 本文, 送信時刻ISO, 宛先をDTO値にする(メッセージ宛先));
    return メッセージ.create({
      連番: Number(結果.lastInsertRowid),
      ルーム,
      送信者,
      本文,
      送信時刻ISO,
      宛先: メッセージ宛先,
    });
  }

  以降を取得する(ルーム: ルームID, 基準連番: number, 上限: number): メッセージ[] {
    const 行一覧 = this.db
      .prepare(
        "SELECT seq, room_id, sender, body, sent_at, to_agent FROM messages WHERE room_id = ? AND seq > ? ORDER BY seq ASC LIMIT ?",
      )
      .all(ルーム.値, 基準連番, 上限);
    return 行一覧.map((生行) => {
      const 行 = メッセージ行に絞る(生行);
      return メッセージ.create({
        連番: 行.seq,
        ルーム: ルームID.create(行.room_id),
        送信者: エージェント名.create(行.sender),
        本文: 行.body,
        送信時刻ISO: 行.sent_at,
        宛先: 宛先をDTO値から作る(行.to_agent),
      });
    });
  }

  最終連番を取得する(ルーム: ルームID): number {
    const 行 = this.db
      .prepare("SELECT MAX(seq) AS last_seq FROM messages WHERE room_id = ?")
      .get(ルーム.値);
    return 最終連番行に絞る(行);
  }
}
