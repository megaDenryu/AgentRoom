import { describe, expect, it } from "vitest";
import { キャラDTOか } from "./キャラ型";

function 有効なキャラDTO(): Record<string, unknown> {
  return {
    名前: "案内役",
    種別: "AI",
    プロンプト: "あなたは案内役です",
    アイコンdataUrl: "data:image/png;base64,AAAA",
    行動パターンメモ: "丁寧に案内する",
    作成者: "人間",
    作成時刻: "2026-07-14T00:00:00.000Z",
    更新時刻: "2026-07-14T00:00:00.000Z",
  };
}

describe("キャラDTOか", () => {
  it("全フィールドがstringで揃っていればtrue", () => {
    expect(キャラDTOか(有効なキャラDTO())).toBe(true);
  });

  it("フィールドが1つ欠けていればfalse", () => {
    const { 行動パターンメモ: _除外, ...欠損 } = 有効なキャラDTO();
    expect(キャラDTOか(欠損)).toBe(false);
  });

  it("フィールドの型が違えばfalse", () => {
    expect(キャラDTOか({ ...有効なキャラDTO(), 名前: 123 })).toBe(false);
  });

  it("null・非オブジェクトはfalse", () => {
    expect(キャラDTOか(null)).toBe(false);
    expect(キャラDTOか("文字列")).toBe(false);
    expect(キャラDTOか(undefined)).toBe(false);
  });
});
