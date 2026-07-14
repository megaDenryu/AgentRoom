import type { メンバーDTO, ルーム概要DTO } from "../通信/メッセージ型";

// ルーム一覧と各ルームのメンバーマップから、メンバー名ごとの参加ルームID一覧を逆引きする
// 純粋関数。参加ルームを横断して調べる専用APIが無いため、既存のルーム一覧・メンバー一覧APIの
// 組み合わせ結果をこの関数で集約する(実際のAPI呼び出しは参加ルーム取得.ts が担う)。
// 値配列はja localeCompareでソートし、呼び出しごとの並び順を決定的にする
export function 参加ルームを逆引きする(
  ルーム一覧: readonly ルーム概要DTO[],
  メンバーマップ: ReadonlyMap<string, readonly メンバーDTO[]>,
): ReadonlyMap<string, readonly string[]> {
  const 集約: Map<string, string[]> = new Map();
  for (const ルーム of ルーム一覧) {
    const メンバー一覧 = メンバーマップ.get(ルーム.ルームID) ?? [];
    for (const メンバー of メンバー一覧) {
      const 既存 = 集約.get(メンバー.名前);
      if (既存 === undefined) {
        集約.set(メンバー.名前, [ルーム.ルームID]);
      } else {
        既存.push(ルーム.ルームID);
      }
    }
  }
  const 結果: Map<string, readonly string[]> = new Map();
  for (const [名前, ルームID一覧] of 集約) {
    結果.set(
      名前,
      [...ルームID一覧].sort((a, b) => a.localeCompare(b, "ja")),
    );
  }
  return 結果;
}
