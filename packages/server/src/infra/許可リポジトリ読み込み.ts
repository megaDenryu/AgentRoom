import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { 許可リポジトリ一覧 } from "../domain/許可リポジトリ一覧.js";

// Jimboの.gitmodulesを起点ディレクトリから親方向へ探索し、載っているsubmodule全部と
// Jimbo自身(.gitmodulesが置かれているディレクトリ名)を許可リポジトリとして返す
// (ユーザー決定事項2026-07-15: 明示登録制は不採用、Jimbo配下のsubmodule全部を自動許可)。
// AgentRoomは通常Jimboのsubmodules配下に配置される前提で動くため(サーバー起動.tsが
// 自分自身のディレクトリを起点に呼ぶ)、単独リポジトリとして別の場所で動かした場合や
// .gitmodulesが見つからない場合は空集合を返す(起動を失敗させない。未設定は使用時に
// 検証エラーとして表面化させる。参照: CLAUDE.md「不在・未設定・使用不可」状態の設計)
export function 許可リポジトリ一覧を読み込む(起点ディレクトリ: string): 許可リポジトリ一覧 {
  const gitmodulesパス = gitmodulesを探す(起点ディレクトリ);
  if (gitmodulesパス === null) {
    return 許可リポジトリ一覧.create([]);
  }
  const 内容 = readFileSync(gitmodulesパス, "utf-8");
  const submodule名一覧 = [...内容.matchAll(/^\s*path\s*=\s*(.+?)\s*$/gm)]
    .map((一致) => 最終セグメントを取り出す(一致[1] ?? ""))
    .filter((名前) => 名前.length > 0);
  const Jimbo自身の名前 = path.basename(path.dirname(gitmodulesパス));
  return 許可リポジトリ一覧.create([Jimbo自身の名前, ...submodule名一覧]);
}

function gitmodulesを探す(起点: string): string | null {
  let 現在 = path.resolve(起点);
  for (;;) {
    const 候補 = path.join(現在, ".gitmodules");
    if (existsSync(候補)) {
      return 候補;
    }
    const 親 = path.dirname(現在);
    if (親 === 現在) {
      return null;
    }
    現在 = 親;
  }
}

function 最終セグメントを取り出す(パス値: string): string {
  const セグメント一覧 = パス値.split(/[\\/]/).filter((セグメント) => セグメント.length > 0);
  return セグメント一覧[セグメント一覧.length - 1] ?? "";
}
