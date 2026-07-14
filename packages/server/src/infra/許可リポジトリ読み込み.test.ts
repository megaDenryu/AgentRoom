import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { 許可リポジトリ一覧を読み込む } from "./許可リポジトリ読み込み.js";

let 作業ディレクトリ一覧: string[] = [];

function 一時ディレクトリを作る(): string {
  const ディレクトリ = mkdtempSync(path.join(tmpdir(), "agentroom-gitmodules-test-"));
  作業ディレクトリ一覧.push(ディレクトリ);
  return ディレクトリ;
}

afterEach(() => {
  for (const ディレクトリ of 作業ディレクトリ一覧) {
    rmSync(ディレクトリ, { recursive: true, force: true });
  }
  作業ディレクトリ一覧 = [];
});

describe("許可リポジトリ一覧を読み込む", () => {
  it(".gitmodulesのsubmoduleパスと自身のディレクトリ名を許可リポジトリにする", () => {
    const Jimbo風ルート = path.join(一時ディレクトリを作る(), "Jimbo");
    mkdirSync(Jimbo風ルート, { recursive: true });
    writeFileSync(
      path.join(Jimbo風ルート, ".gitmodules"),
      [
        '[submodule "submodules/AgentRoom"]',
        "\tpath = submodules/AgentRoom",
        "\turl = git@github.com:example/AgentRoom.git",
        '[submodule "submodules/Fudaba"]',
        "\tpath = submodules/Fudaba",
        "\turl = git@github.com:example/Fudaba.git",
        "",
      ].join("\n"),
      "utf-8",
    );
    const AgentRoom風起点 = path.join(Jimbo風ルート, "submodules", "AgentRoom", "packages", "server", "src");
    mkdirSync(AgentRoom風起点, { recursive: true });

    const 一覧 = 許可リポジトリ一覧を読み込む(AgentRoom風起点);
    expect(一覧.含むか("Jimbo")).toBe(true);
    expect(一覧.含むか("AgentRoom")).toBe(true);
    expect(一覧.含むか("Fudaba")).toBe(true);
    expect(一覧.含むか("未知のリポジトリ")).toBe(false);
  });

  it(".gitmodulesが見つからない場合は空の許可一覧を返す(起動を失敗させない)", () => {
    const 孤立ディレクトリ = 一時ディレクトリを作る();
    const 一覧 = 許可リポジトリ一覧を読み込む(path.join(孤立ディレクトリ, "no-such-subdir"));
    expect(一覧.値一覧).toEqual([]);
  });
});
