import { describe, expect, it } from "vitest";
import { アイコンDataUrl } from "./アイコンDataUrl.js";
import { エージェント名 } from "./エージェント名.js";
import { エージェント種別 } from "./エージェント種別.js";
import { キャラ種別 } from "./キャラ種別.js";
import { キャラプロンプト } from "./キャラプロンプト.js";
import { ルームID } from "./ルームID.js";
import { 個別宛, 全員宛, 宛先をDTO値にする, 宛先をDTO値から作る } from "./宛先.js";
import { 検証エラー } from "./検証エラー.js";
import { 文書パス } from "./文書パス.js";
import { 文書リポジトリ名 } from "./文書リポジトリ名.js";
import { 文書タイトル } from "./文書タイトル.js";
import { 文書概要 } from "./文書概要.js";
import { 許可リポジトリ一覧 } from "./許可リポジトリ一覧.js";
import { 行動パターンメモ } from "./行動パターンメモ.js";

describe("ルームID", () => {
  it("英数字・ハイフン・アンダースコアを受け入れる", () => {
    expect(ルームID.create("dev-room_1").値).toBe("dev-room_1");
  });

  it("日本語を受け入れる", () => {
    expect(ルームID.create("テストルーム").値).toBe("テストルーム");
  });

  it("パス区切り文字を弾く", () => {
    expect(() => ルームID.create("a/b")).toThrow(検証エラー);
    expect(() => ルームID.create("a\\b")).toThrow(検証エラー);
  });

  it("制御文字を弾く", () => {
    expect(() => ルームID.create("a\nb")).toThrow(検証エラー);
  });

  it("前後の空白を弾く", () => {
    expect(() => ルームID.create(" room")).toThrow(検証エラー);
    expect(() => ルームID.create("room ")).toThrow(検証エラー);
  });

  it("長さ制約を弾く", () => {
    expect(() => ルームID.create("")).toThrow(検証エラー);
    expect(() => ルームID.create("あ".repeat(65))).toThrow(検証エラー);
    expect(ルームID.create("あ".repeat(64)).値.length).toBe(64);
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

describe("エージェント種別", () => {
  it("許可された種別だけを受け入れる", () => {
    expect(エージェント種別.create("claude-code").値).toBe("claude-code");
    expect(エージェント種別.create("human").値).toBe("human");
    expect(() => エージェント種別.create("unknown-agent")).toThrow(検証エラー);
    expect(() => エージェント種別.create("")).toThrow(検証エラー);
  });
});

describe("宛先", () => {
  it("DTO値との相互変換で null=全員 / string=個別 に写像される", () => {
    expect(宛先をDTO値にする(全員宛)).toBeNull();
    expect(宛先をDTO値にする(個別宛(エージェント名.create("AI2")))).toBe("AI2");

    expect(宛先をDTO値から作る(null).種別).toBe("全員");
    const 個別 = 宛先をDTO値から作る("AI2");
    expect(個別.種別).toBe("個別");
    if (個別.種別 === "個別") {
      expect(個別.名前.値).toBe("AI2");
    }
  });
});

describe("キャラ種別", () => {
  it("人間とAIだけを受け入れる", () => {
    expect(キャラ種別.create("人間").値).toBe("人間");
    expect(キャラ種別.create("AI").値).toBe("AI");
    expect(() => キャラ種別.create("claude-code")).toThrow(検証エラー);
    expect(() => キャラ種別.create("")).toThrow(検証エラー);
  });
});

describe("キャラプロンプト", () => {
  it("未指定は空文字列に正規化される", () => {
    expect(キャラプロンプト.create(undefined).値).toBe("");
    expect(キャラプロンプト.create(null).値).toBe("");
  });

  it("上限文字数を超えると検証エラーになる", () => {
    expect(() => キャラプロンプト.create("あ".repeat(20001))).toThrow(検証エラー);
    expect(キャラプロンプト.create("あ".repeat(20000)).値.length).toBe(20000);
  });
});

describe("行動パターンメモ", () => {
  it("未指定は空文字列に正規化される", () => {
    expect(行動パターンメモ.create(undefined).値).toBe("");
  });

  it("上限文字数を超えると検証エラーになる", () => {
    expect(() => 行動パターンメモ.create("あ".repeat(4001))).toThrow(検証エラー);
  });
});

describe("アイコンDataUrl", () => {
  it("未指定・空文字は空文字列（アイコン無し）に正規化される", () => {
    expect(アイコンDataUrl.create(undefined).値).toBe("");
    expect(アイコンDataUrl.create("").値).toBe("");
    expect(アイコンDataUrl.create("   ").値).toBe("");
  });

  it("data:始まりの文字列を受け入れる", () => {
    const 値 = "data:image/png;base64,AAAA";
    expect(アイコンDataUrl.create(値).値).toBe(値);
  });

  it("data:始まりでない文字列は検証エラーになる", () => {
    expect(() => アイコンDataUrl.create("https://example.com/icon.png")).toThrow(検証エラー);
  });
});

describe("文書リポジトリ名", () => {
  it("英数字名を受け入れる", () => {
    expect(文書リポジトリ名.create("AgentRoom").値).toBe("AgentRoom");
  });

  it("パス区切り文字・空文字を弾く", () => {
    expect(() => 文書リポジトリ名.create("a/b")).toThrow(検証エラー);
    expect(() => 文書リポジトリ名.create("")).toThrow(検証エラー);
  });
});

describe("文書パス", () => {
  it("リポジトリ相対パスを受け入れる", () => {
    expect(文書パス.create("DESIGN.md").値).toBe("DESIGN.md");
    expect(文書パス.create("_doc/開発スレッド.md").値).toBe("_doc/開発スレッド.md");
  });

  it("絶対パスを弾く", () => {
    expect(() => 文書パス.create("/etc/passwd")).toThrow(検証エラー);
    expect(() => 文書パス.create("C:\\Windows\\System32")).toThrow(検証エラー);
  });

  it("パストラバーサル(..)を弾く", () => {
    expect(() => 文書パス.create("../../etc/passwd")).toThrow(検証エラー);
    expect(() => 文書パス.create("a/../b")).toThrow(検証エラー);
  });

  it("前後の空白・空文字を弾く", () => {
    expect(() => 文書パス.create(" a.md")).toThrow(検証エラー);
    expect(() => 文書パス.create("")).toThrow(検証エラー);
  });
});

describe("文書タイトル", () => {
  it("前後の空白を除去する", () => {
    expect(文書タイトル.create(" 設計文書 ").値).toBe("設計文書");
  });

  it("空文字は検証エラーになる", () => {
    expect(() => 文書タイトル.create("   ")).toThrow(検証エラー);
  });

  it("上限文字数を超えると検証エラーになる", () => {
    expect(() => 文書タイトル.create("あ".repeat(301))).toThrow(検証エラー);
    expect(文書タイトル.create("あ".repeat(300)).値.length).toBe(300);
  });
});

describe("文書概要", () => {
  it("未指定・空文字はnullに正規化される", () => {
    expect(文書概要.create(undefined).値).toBeNull();
    expect(文書概要.create(null).値).toBeNull();
    expect(文書概要.create("  ").値).toBeNull();
  });

  it("上限文字数を超えると検証エラーになる", () => {
    expect(() => 文書概要.create("あ".repeat(2001))).toThrow(検証エラー);
  });
});

describe("許可リポジトリ一覧", () => {
  it("登録済みの名前だけを含むと判定する", () => {
    const 一覧 = 許可リポジトリ一覧.create(["Jimbo", "AgentRoom", "Fudaba"]);
    expect(一覧.含むか("AgentRoom")).toBe(true);
    expect(一覧.含むか("未知のリポジトリ")).toBe(false);
  });

  it("空の一覧はどの名前も含まない", () => {
    const 一覧 = 許可リポジトリ一覧.create([]);
    expect(一覧.含むか("Jimbo")).toBe(false);
  });
});
