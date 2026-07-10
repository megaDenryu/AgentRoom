import { describe, expect, it } from "vitest";
import { エージェント名 } from "./エージェント名.js";
import { ルームID } from "./ルームID.js";
import { 検証エラー } from "./検証エラー.js";

describe("ルームID", () => {
  it("英数字・ハイフン・アンダースコアを受け入れる", () => {
    expect(ルームID.create("dev-room_1").値).toBe("dev-room_1");
  });

  it("URLに安全でない文字を弾く", () => {
    expect(() => ルームID.create("a/b")).toThrow(検証エラー);
    expect(() => ルームID.create("日本語")).toThrow(検証エラー);
    expect(() => ルームID.create("")).toThrow(検証エラー);
  });
});

describe("エージェント名", () => {
  it("日本語名を受け入れ、前後の空白を除去する", () => {
    expect(エージェント名.create(" フィーちゃん ").値).toBe("フィーちゃん");
  });

  it("空文字と制御文字を弾く", () => {
    expect(() => エージェント名.create("   ")).toThrow(検証エラー);
    expect(() => エージェント名.create("a\nb")).toThrow(検証エラー);
  });
});
