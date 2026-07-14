import { describe, expect, it } from "vitest";
import { 文書概要 } from "../domain/文書概要.js";
import { 文書パス } from "../domain/文書パス.js";
import { 文書リポジトリ名 } from "../domain/文書リポジトリ名.js";
import { 文書タイトル } from "../domain/文書タイトル.js";
import { メッセージストア } from "./メッセージストア.js";

const AgentRoom = 文書リポジトリ名.create("AgentRoom");
const Fudaba = 文書リポジトリ名.create("Fudaba");

describe("文書索引", () => {
  it("登録した文書が一覧に載る", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.文書索引を登録または更新する(
      AgentRoom,
      文書パス.create("DESIGN.md"),
      文書タイトル.create("AgentRoom設計文書"),
      文書概要.create("AI間会話中継サーバーの設計"),
    );
    const 一覧 = ストア.文書索引一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(一覧[0]?.リポジトリ.値).toBe("AgentRoom");
    expect(一覧[0]?.パス.値).toBe("DESIGN.md");
    expect(一覧[0]?.タイトル.値).toBe("AgentRoom設計文書");
    expect(一覧[0]?.概要.値).toBe("AI間会話中継サーバーの設計");
    expect(一覧[0]?.ID).toBeGreaterThan(0);
  });

  it("同じリポジトリ+パスの再登録は上書きになり、行が増えず登録時刻は保たれる", () => {
    const ストア = メッセージストア.メモリ上に作る();
    const 初回 = ストア.文書索引を登録または更新する(
      AgentRoom,
      文書パス.create("DESIGN.md"),
      文書タイトル.create("旧タイトル"),
      文書概要.create(undefined),
    );
    const 再登録 = ストア.文書索引を登録または更新する(
      AgentRoom,
      文書パス.create("DESIGN.md"),
      文書タイトル.create("新タイトル"),
      文書概要.create("更新後の概要"),
    );

    const 一覧 = ストア.文書索引一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(再登録.ID).toBe(初回.ID);
    expect(再登録.タイトル.値).toBe("新タイトル");
    expect(再登録.概要.値).toBe("更新後の概要");
    expect(再登録.登録時刻ISO).toBe(初回.登録時刻ISO);
  });

  it("同じリポジトリでもパスが違えば別エントリになる", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.文書索引を登録または更新する(
      AgentRoom,
      文書パス.create("DESIGN.md"),
      文書タイトル.create("設計文書"),
      文書概要.create(undefined),
    );
    ストア.文書索引を登録または更新する(
      AgentRoom,
      文書パス.create("README.md"),
      文書タイトル.create("README"),
      文書概要.create(undefined),
    );
    expect(ストア.文書索引一覧を取得する()).toHaveLength(2);
  });

  it("異なるリポジトリの一覧がリポジトリ名・パス順に並ぶ", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.文書索引を登録または更新する(
      Fudaba,
      文書パス.create("DESIGN.md"),
      文書タイトル.create("Fudaba設計文書"),
      文書概要.create(undefined),
    );
    ストア.文書索引を登録または更新する(
      AgentRoom,
      文書パス.create("DESIGN.md"),
      文書タイトル.create("AgentRoom設計文書"),
      文書概要.create(undefined),
    );
    const 一覧 = ストア.文書索引一覧を取得する();
    expect(一覧.map((エントリ) => エントリ.リポジトリ.値)).toEqual(["AgentRoom", "Fudaba"]);
  });
});
