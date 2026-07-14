import { describe, expect, it } from "vitest";
import type { メンバーDTO, ルーム概要DTO } from "../通信/メッセージ型";
import { 参加ルームを逆引きする } from "./参加ルーム逆引き";

function ルームを作る(ルームID: string): ルーム概要DTO {
  return {
    ルームID,
    メッセージ数: 0,
    最終連番: 0,
    最終送信時刻: "2026-07-14T00:00:00.000Z",
    未読数: 0,
  };
}

function メンバーを作る(名前: string): メンバーDTO {
  return { 名前, 種別: "human", 参加時刻: "2026-07-14T00:00:00.000Z" };
}

describe("参加ルームを逆引きする", () => {
  it("複数ルームのメンバーをそれぞれのルームIDに逆引きする", () => {
    const 結果 = 参加ルームを逆引きする(
      [ルームを作る("room-a"), ルームを作る("room-b")],
      new Map([
        ["room-a", [メンバーを作る("案内役")]],
        ["room-b", [メンバーを作る("記録係")]],
      ]),
    );
    expect(結果.get("案内役")).toEqual(["room-a"]);
    expect(結果.get("記録係")).toEqual(["room-b"]);
  });

  it("同一人物が複数ルームに所属していれば両方のルームIDを持つ", () => {
    const 結果 = 参加ルームを逆引きする(
      [ルームを作る("room-b"), ルームを作る("room-a")],
      new Map([
        ["room-b", [メンバーを作る("案内役")]],
        ["room-a", [メンバーを作る("案内役")]],
      ]),
    );
    expect(結果.get("案内役")).toEqual(["room-a", "room-b"]);
  });

  it("どのルームにも所属しない人物のエントリは作られない", () => {
    const 結果 = 参加ルームを逆引きする(
      [ルームを作る("room-a")],
      new Map([["room-a", [メンバーを作る("案内役")]]]),
    );
    expect(結果.has("孤立キャラ")).toBe(false);
    expect(結果.get("孤立キャラ")).toBeUndefined();
  });

  it("ルームもメンバーも無ければ空のマップになる", () => {
    const 結果 = 参加ルームを逆引きする([], new Map());
    expect(結果.size).toBe(0);
  });
});
