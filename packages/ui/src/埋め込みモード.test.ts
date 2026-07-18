import { describe, expect, it } from "vitest";
import { Jimbo埋め込み中か, 埋め込み表示対象か } from "./埋め込みモード";

describe("Jimbo埋め込みモード", () => {
  it("host=jimboだけを埋め込みと判定する", () => {
    expect(Jimbo埋め込み中か("?host=jimbo")).toBe(true);
    expect(Jimbo埋め込み中か("")).toBe(false);
  });

  it("埋め込み時だけ札場とキャラを隠す", () => {
    expect(埋め込み表示対象か("札場", true)).toBe(false);
    expect(埋め込み表示対象か("キャラ", true)).toBe(false);
    expect(埋め込み表示対象か("判定", true)).toBe(true);
    expect(埋め込み表示対象か("キャラ", false)).toBe(true);
  });
});
