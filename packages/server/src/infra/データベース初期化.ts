import type Database from "better-sqlite3";

// スキーマ作成とマイグレーションを1箇所に集約する。既存の会話DBを開いたときも
// 安全に呼べる（CREATE TABLE IF NOT EXISTS + 列存在チェック後のALTERのみ）
export function データベースを初期化する(db: Database.Database): void {
  db.pragma("journal_mode = WAL");
  // 注意: messagesのCREATE文は宛先導入前の形のまま維持し、to_agent列は新規DB・既存DBの
  // 両方で下のマイグレーションが追加する。列追加の経路を1本化して既存の会話DBを壊さないため
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      body TEXT NOT NULL,
      sent_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_messages_room_seq ON messages(room_id, seq);
    CREATE TABLE IF NOT EXISTS members (
      room_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      joined_at TEXT NOT NULL,
      PRIMARY KEY (room_id, name)
    );
    CREATE TABLE IF NOT EXISTS read_positions (
      room_id TEXT NOT NULL,
      reader TEXT NOT NULL,
      last_read_seq INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (room_id, reader)
    );
    CREATE TABLE IF NOT EXISTS presence (
      name TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      current_work TEXT,
      card_id INTEGER,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS charas (
      name TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      icon_data_url TEXT NOT NULL,
      behavior_note TEXT NOT NULL,
      creator TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  宛先列を追加する(db);
}

function 宛先列を追加する(db: Database.Database): void {
  const 列一覧: unknown = db.pragma("table_info(messages)");
  if (!Array.isArray(列一覧)) {
    throw new Error("PRAGMA table_info(messages) の結果が配列ではありません");
  }
  const to_agentあり = 列一覧.some(
    (列: unknown) =>
      typeof 列 === "object" &&
      列 !== null &&
      "name" in 列 &&
      列.name === "to_agent",
  );
  if (!to_agentあり) {
    db.exec("ALTER TABLE messages ADD COLUMN to_agent TEXT");
  }
}
