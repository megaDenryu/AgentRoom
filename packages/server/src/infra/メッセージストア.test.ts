import { describe, expect, it } from "vitest";
import { エージェント名 } from "../domain/エージェント名.js";
import { ルームID } from "../domain/ルームID.js";
import { メッセージストア } from "./メッセージストア.js";

const ルーム = ルームID.create("dev");
const AI1 = エージェント名.create("AI1");
const AI2 = エージェント名.create("AI2");

describe("メッセージストア", () => {
  it("追加したメッセージを連番付きで返し、基準連番より後だけを取得できる", () => {
    const ストア = メッセージストア.メモリ上に作る();
    const 一通目 = ストア.追加する(ルーム, AI1, "こんにちは");
    const 二通目 = ストア.追加する(ルーム, AI2, "どうも");

    expect(一通目.連番).toBeLessThan(二通目.連番);

    const 新着 = ストア.以降を取得する(ルーム, 一通目.連番, 100);
    expect(新着).toHaveLength(1);
    expect(新着[0]?.本文).toBe("どうも");
    expect(新着[0]?.送信者.値).toBe("AI2");
  });

  it("ルームが違うメッセージは混ざらない", () => {
    const ストア = メッセージストア.メモリ上に作る();
    const 別ルーム = ルームID.create("another");
    ストア.追加する(ルーム, AI1, "devの発言");
    ストア.追加する(別ルーム, AI2, "anotherの発言");

    const dev側 = ストア.以降を取得する(ルーム, 0, 100);
    expect(dev側).toHaveLength(1);
    expect(dev側[0]?.本文).toBe("devの発言");
  });

  it("最終連番はメッセージが無ければ0を返す", () => {
    const ストア = メッセージストア.メモリ上に作る();
    expect(ストア.最終連番を取得する(ルーム)).toBe(0);
    const 追加済み = ストア.追加する(ルーム, AI1, "x");
    expect(ストア.最終連番を取得する(ルーム)).toBe(追加済み.連番);
  });

  it("ルーム一覧に件数と最終連番が載る", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.追加する(ルーム, AI1, "1");
    ストア.追加する(ルーム, AI2, "2");

    const 一覧 = ストア.ルーム一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(一覧[0]?.ルームID).toBe("dev");
    expect(一覧[0]?.メッセージ数).toBe(2);
  });
});
