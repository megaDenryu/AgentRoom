import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";
import { エージェント名 } from "../domain/エージェント名.js";
import { ルームID } from "../domain/ルームID.js";
import { 個別宛 } from "../domain/宛先.js";
import { メッセージストア } from "./メッセージストア.js";

const 一時ディレクトリ一覧: string[] = [];

function 一時DBパスを作る(): string {
  const ディレクトリ = mkdtempSync(path.join(tmpdir(), "agentroom-migration-"));
  一時ディレクトリ一覧.push(ディレクトリ);
  return path.join(ディレクトリ, "agentroom.sqlite3");
}

afterEach(() => {
  for (const ディレクトリ of 一時ディレクトリ一覧.splice(0)) {
    rmSync(ディレクトリ, { recursive: true, force: true });
  }
});

describe("旧スキーマDBのマイグレーション", () => {
  it("to_agent列の無い既存DBを開くと列が追加され、既存メッセージは全員宛として読める", () => {
    const DBパス = 一時DBパスを作る();

    // 宛先導入前のスキーマでDBを作り、既存の会話を入れておく
    const 旧db = new Database(DBパス);
    旧db.exec(`
      CREATE TABLE messages (
        seq INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        body TEXT NOT NULL,
        sent_at TEXT NOT NULL
      );
      CREATE INDEX idx_messages_room_seq ON messages(room_id, seq);
    `);
    旧db
      .prepare("INSERT INTO messages (room_id, sender, body, sent_at) VALUES (?, ?, ?, ?)")
      .run("dev", "AI1", "移行前の発言", "2026-07-01T00:00:00.000Z");
    旧db.close();

    const ストア = メッセージストア.ファイルから開く(DBパス);
    try {
      const ルーム = ルームID.create("dev");
      const 既存 = ストア.以降を取得する(ルーム, 0, 100);
      expect(既存).toHaveLength(1);
      expect(既存[0]?.本文).toBe("移行前の発言");
      expect(既存[0]?.宛先.種別).toBe("全員");

      // 移行後は宛先付きメッセージも書き込める
      const 新規 = ストア.追加する(
        ルーム,
        エージェント名.create("AI1"),
        "移行後の個別宛",
        個別宛(エージェント名.create("AI2")),
      );
      expect(新規.toJSON().宛先).toBe("AI2");
    } finally {
      ストア.閉じる();
    }
  });

  it("移行済みDBを再度開いても壊れない（マイグレーションの冪等性）", () => {
    const DBパス = 一時DBパスを作る();

    const 一度目 = メッセージストア.ファイルから開く(DBパス);
    一度目.追加する(ルームID.create("dev"), エージェント名.create("AI1"), "一度目");
    一度目.閉じる();

    const 二度目 = メッセージストア.ファイルから開く(DBパス);
    try {
      expect(二度目.以降を取得する(ルームID.create("dev"), 0, 100)).toHaveLength(1);
    } finally {
      二度目.閉じる();
    }
  });
});
