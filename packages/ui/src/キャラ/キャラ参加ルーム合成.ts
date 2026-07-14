import type { キャラ稼働合成 } from "./キャラ稼働合成";

// キャラ稼働合成一覧に参加ルームマップ(参加ルーム逆引き.ts)を付与する純粋関数。
// presence合成(キャラ一覧に稼働状況を合成する)とは別ステップに分離し、それぞれ単一責務を保つ
export function キャラ合成に参加ルームを付与する(
  合成一覧: readonly キャラ稼働合成[],
  参加ルームマップ: ReadonlyMap<string, readonly string[]>,
): readonly キャラ稼働合成[] {
  return 合成一覧.map((合成) => ({
    ...合成,
    参加ルーム一覧: 参加ルームマップ.get(合成.キャラ.名前) ?? [],
  }));
}
