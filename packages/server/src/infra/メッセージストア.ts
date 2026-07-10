import Database from "better-sqlite3";
import { エージェント名 } from "../domain/エージェント名.js";
import { メッセージ } from "../domain/メッセージ.js";
import { ルームID } from "../domain/ルームID.js";
import type { ルーム概要 } from "../domain/ルーム概要.js";
import { 検証エラー } from "../domain/検証エラー.js";

// better-sqlite3の戻り値はunknownなので、外部境界としてここで型ガードして絞る。
// スキーマは自分で定義しているため不一致はバグであり、例外で即座に露見させる
function メッセージ行に絞る(行: unknown): {
  seq: number;
  room_id: string;
  sender: string;
  body: string;
  sent_at: string;
} {
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "seq" in 行 &&
    typeof 行.seq === "number" &&
    "room_id" in 行 &&
    typeof 行.room_id === "string" &&
    "sender" in 行 &&
    typeof 行.sender === "string" &&
    "body" in 行 &&
    typeof 行.body === "string" &&
    "sent_at" in 行 &&
    typeof 行.sent_at === "string"
  ) {
    return {
      seq: 行.seq,
      room_id: 行.room_id,
      sender: 行.sender,
      body: 行.body,
      sent_at: 行.sent_at,
    };
  }
  throw new Error(`messagesテーブルの行がスキーマと一致しません: ${JSON.stringify(行)}`);
}

function ルーム概要行に絞る(行: unknown): {
  room_id: string;
  message_count: number;
  last_seq: number;
  last_sent_at: string;
} {
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "room_id" in 行 &&
    typeof 行.room_id === "string" &&
    "message_count" in 行 &&
    typeof 行.message_count === "number" &&
    "last_seq" in 行 &&
    typeof 行.last_seq === "number" &&
    "last_sent_at" in 行 &&
    typeof 行.last_sent_at === "string"
  ) {
    return {
      room_id: 行.room_id,
      message_count: 行.message_count,
      last_seq: 行.last_seq,
      last_sent_at: 行.last_sent_at,
    };
  }
  throw new Error(`ルーム概要クエリの行が想定と一致しません: ${JSON.stringify(行)}`);
}

function 最終連番行に絞る(行: unknown): number {
  if (typeof 行 === "object" && 行 !== null && "last_seq" in 行) {
    if (行.last_seq === null) return 0;
    if (typeof 行.last_seq === "number") return 行.last_seq;
  }
  throw new Error(`最終連番クエリの行が想定と一致しません: ${JSON.stringify(行)}`);
}

export class メッセージストア {
  private constructor(private readonly db: Database.Database) {}

  static ファイルから開く(パス: string): メッセージストア {
    return メッセージストア.初期化(new Database(パス));
  }

  static メモリ上に作る(): メッセージストア {
    return メッセージストア.初期化(new Database(":memory:"));
  }

  private static 初期化(db: Database.Database): メッセージストア {
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        seq INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        body TEXT NOT NULL,
        sent_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_messages_room_seq ON messages(room_id, seq);
    `);
    return new メッセージストア(db);
  }

  追加する(ルーム: ルームID, 送信者: エージェント名, 本文: string): メッセージ {
    if (本文.length === 0) {
      throw new 検証エラー("本文が空のメッセージは追加できません");
    }
    const 送信時刻ISO = new Date().toISOString();
    const 結果 = this.db
      .prepare(
        "INSERT INTO messages (room_id, sender, body, sent_at) VALUES (?, ?, ?, ?)",
      )
      .run(ルーム.値, 送信者.値, 本文, 送信時刻ISO);
    return メッセージ.create({
      連番: Number(結果.lastInsertRowid),
      ルーム,
      送信者,
      本文,
      送信時刻ISO,
    });
  }

  以降を取得する(ルーム: ルームID, 基準連番: number, 上限: number): メッセージ[] {
    const 行一覧 = this.db
      .prepare(
        "SELECT seq, room_id, sender, body, sent_at FROM messages WHERE room_id = ? AND seq > ? ORDER BY seq ASC LIMIT ?",
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
      });
    });
  }

  最終連番を取得する(ルーム: ルームID): number {
    const 行 = this.db
      .prepare("SELECT MAX(seq) AS last_seq FROM messages WHERE room_id = ?")
      .get(ルーム.値);
    return 最終連番行に絞る(行);
  }

  ルーム一覧を取得する(): ルーム概要[] {
    const 行一覧 = this.db
      .prepare(
        "SELECT room_id, COUNT(*) AS message_count, MAX(seq) AS last_seq, MAX(sent_at) AS last_sent_at FROM messages GROUP BY room_id ORDER BY last_seq DESC",
      )
      .all();
    return 行一覧.map((生行) => {
      const 行 = ルーム概要行に絞る(生行);
      return {
        ルームID: 行.room_id,
        メッセージ数: 行.message_count,
        最終連番: 行.last_seq,
        最終送信時刻: 行.last_sent_at,
      };
    });
  }

  閉じる(): void {
    this.db.close();
  }
}
