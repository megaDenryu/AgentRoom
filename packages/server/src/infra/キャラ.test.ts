import { describe, expect, it } from "vitest";
import { アイコンDataUrl } from "../domain/アイコンDataUrl.js";
import { エージェント名 } from "../domain/エージェント名.js";
import { キャラ種別 } from "../domain/キャラ種別.js";
import { キャラプロンプト } from "../domain/キャラプロンプト.js";
import { 行動パターンメモ } from "../domain/行動パターンメモ.js";
import { メッセージストア } from "./メッセージストア.js";

const 茜 = エージェント名.create("茜");
const 助手A = エージェント名.create("助手A");
const 作成者 = エージェント名.create("作成した人");

describe("キャラ", () => {
  it("作成したキャラが一覧に載る", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.キャラを作成または更新する(
      茜,
      キャラ種別.create("人間"),
      キャラプロンプト.create("丁寧に話す"),
      アイコンDataUrl.create(undefined),
      行動パターンメモ.create("慎重派"),
      作成者,
    );
    const 一覧 = ストア.キャラ一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(一覧[0]?.名前.値).toBe("茜");
    expect(一覧[0]?.種別.値).toBe("人間");
    expect(一覧[0]?.プロンプト.値).toBe("丁寧に話す");
    expect(一覧[0]?.行動パターンメモ.値).toBe("慎重派");
    expect(一覧[0]?.作成者.値).toBe("作成した人");
  });

  it("同名の再登録は上書きになり、行が増えず作成時刻・作成者は保たれる", () => {
    const ストア = メッセージストア.メモリ上に作る();
    const 初回 = ストア.キャラを作成または更新する(
      茜,
      キャラ種別.create("人間"),
      キャラプロンプト.create("最初のプロンプト"),
      アイコンDataUrl.create(undefined),
      行動パターンメモ.create(undefined),
      作成者,
    );
    const 別作成者 = エージェント名.create("別の人");
    const 再登録 = ストア.キャラを作成または更新する(
      茜,
      キャラ種別.create("AI"),
      キャラプロンプト.create("更新後のプロンプト"),
      アイコンDataUrl.create(undefined),
      行動パターンメモ.create(undefined),
      別作成者,
    );

    const 一覧 = ストア.キャラ一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(再登録.種別.値).toBe("AI");
    expect(再登録.プロンプト.値).toBe("更新後のプロンプト");
    // 作成者・作成時刻は初回登録時のまま変わらない（provenance情報として不変）
    expect(再登録.作成者.値).toBe("作成した人");
    expect(再登録.作成時刻ISO).toBe(初回.作成時刻ISO);
  });

  it("削除したキャラは一覧から消える", () => {
    const ストア = メッセージストア.メモリ上に作る();
    ストア.キャラを作成または更新する(
      茜,
      キャラ種別.create("人間"),
      キャラプロンプト.create(undefined),
      アイコンDataUrl.create(undefined),
      行動パターンメモ.create(undefined),
      作成者,
    );
    ストア.キャラを作成または更新する(
      助手A,
      キャラ種別.create("AI"),
      キャラプロンプト.create(undefined),
      アイコンDataUrl.create(undefined),
      行動パターンメモ.create(undefined),
      作成者,
    );
    ストア.キャラを削除する(茜);
    const 一覧 = ストア.キャラ一覧を取得する();
    expect(一覧).toHaveLength(1);
    expect(一覧[0]?.名前.値).toBe("助手A");
  });

  it("アイコンdataUrlの往復とAI種別の登録ができる", () => {
    const ストア = メッセージストア.メモリ上に作る();
    const dataUrl値 = "data:image/png;base64,AAAA";
    const 登録後 = ストア.キャラを作成または更新する(
      助手A,
      キャラ種別.create("AI"),
      キャラプロンプト.create("従順に動く"),
      アイコンDataUrl.create(dataUrl値),
      行動パターンメモ.create(undefined),
      作成者,
    );
    expect(登録後.アイコン.値).toBe(dataUrl値);

    const 一覧 = ストア.キャラ一覧を取得する();
    const 再取得 = 一覧.find((対象) => 対象.名前.値 === "助手A");
    expect(再取得?.アイコン.値).toBe(dataUrl値);
  });
});
