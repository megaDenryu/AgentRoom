import { describe, expect, it } from "vitest";
import { エージェント名 } from "../domain/エージェント名.js";
import { 参照札ID } from "../domain/参照札ID.js";
import { 検証エラー } from "../domain/検証エラー.js";
import { 現在の作業内容 } from "../domain/現在の作業内容.js";
import { 稼働状態 } from "../domain/稼働状態.js";
import { 稼働表明TTLミリ秒 } from "../domain/稼働表明.js";
import { メッセージストア } from "./メッセージストア.js";

const AI1 = エージェント名.create("AI1");
const AI2 = エージェント名.create("AI2");

describe("稼働表明", () => {
  it("更新した稼働表明が一覧に載る", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.稼働を更新する(
      AI1,
      稼働状態.create("稼働中"),
      現在の作業内容.create("札#2の実装"),
      参照札ID.create(2),
    );
    const 一覧 = ストア.稼働一覧を取得する();
    expect(一覧).toHaveLength(1);
    const 表明 = 一覧[0];
    expect(表明?.名前.値).toBe("AI1");
    expect(表明?.状態.値).toBe("稼働中");
    expect(表明?.現在の作業.値).toBe("札#2の実装");
    expect(表明?.参照札?.値).toBe(2);
  });

  it("同名の再更新は上書きになり、行が増えない", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.稼働を更新する(AI1, 稼働状態.create("稼働中"), 現在の作業内容.create(undefined), null);
    ストア.稼働を更新する(AI1, 稼働状態.create("待機中"), 現在の作業内容.create(undefined), null);
    const 一覧 = ストア.稼働一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(一覧[0]?.状態.値).toBe("待機中");
  });

  it("現在の作業・札IDは未指定なら null になる", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.稼働を更新する(AI1, 稼働状態.create("待機中"), 現在の作業内容.create(undefined), null);
    const 表明 = ストア.稼働一覧を取得する()[0];
    expect(表明?.現在の作業.値).toBeNull();
    expect(表明?.参照札).toBeNull();
  });

  it("複数人の稼働表明が名前順に並ぶ", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.稼働を更新する(AI2, 稼働状態.create("稼働中"), 現在の作業内容.create(undefined), null);
    ストア.稼働を更新する(AI1, 稼働状態.create("待機中"), 現在の作業内容.create(undefined), null);
    const 一覧 = ストア.稼働一覧を取得する();
    expect(一覧.map((表明) => 表明.名前.値)).toEqual(["AI1", "AI2"]);
  });

  it("最終更新からTTLを超えると表示状態は不明になる", () => {
    const ストア = メッセージストア.メモリ上に作る();
    const 表明 = ストア.稼働を更新する(
      AI1,
      稼働状態.create("稼働中"),
      現在の作業内容.create(undefined),
      null,
    );
    const 更新時刻ミリ秒 = new Date(表明.更新時刻ISO).getTime();

    expect(表明.表示状態を計算する(更新時刻ミリ秒 + 1_000)).toBe("稼働中");
    expect(表明.表示状態を計算する(更新時刻ミリ秒 + 稼働表明TTLミリ秒 - 1)).toBe("稼働中");
    expect(表明.表示状態を計算する(更新時刻ミリ秒 + 稼働表明TTLミリ秒 + 1)).toBe("不明");
  });

  it("TTL経過後もレコード自体は削除されず、一覧取得の応答時にだけ不明化される", () => {
    const ストア = メッセージストア.メモリ上に作る();
    const 表明 = ストア.稼働を更新する(
      AI1,
      稼働状態.create("稼働中"),
      現在の作業内容.create(undefined),
      null,
    );
    const 遠い未来 = new Date(表明.更新時刻ISO).getTime() + 稼働表明TTLミリ秒 + 60_000;

    const 一覧 = ストア.稼働一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(一覧[0]?.toJSON(遠い未来).状態).toBe("不明");
    expect(一覧[0]?.状態.値).toBe("稼働中");
  });

  it("不正な状態文字列は検証エラーになる", () => {
    expect(() => 稼働状態.create("実行中")).toThrow(検証エラー);
  });

  it("0以下や小数の札IDは検証エラーになる", () => {
    expect(() => 参照札ID.create(0)).toThrow(検証エラー);
    expect(() => 参照札ID.create(1.5)).toThrow(検証エラー);
    expect(参照札ID.create(null)).toBeNull();
    expect(参照札ID.create(undefined)).toBeNull();
  });

  it("201文字以上の現在の作業は検証エラーになる", () => {
    expect(() => 現在の作業内容.create("あ".repeat(201))).toThrow(検証エラー);
    expect(現在の作業内容.create("").値).toBeNull();
    expect(現在の作業内容.create("  ").値).toBeNull();
  });
});
