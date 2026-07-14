import type { キャラDTO } from "../通信/キャラ型";
import type { 稼働表明DTO } from "../通信/メッセージ型";

// キャラ一覧と稼働表明一覧(GET /api/presence)を名前で突き合わせた合成結果。
// キャラは稼働表明していないこともある(起動していないAI・稼働報告しない人間等)ため、
// 稼働状態はnull(未申告)を許容する
export interface キャラ稼働合成 {
  readonly キャラ: キャラDTO;
  readonly 稼働状態: 稼働表明DTO["状態"] | null;
}

// 純粋関数(副作用なし)。デスクトップのキャラタブ・モバイルのキャラ一覧ビューの双方が使う
export function キャラ一覧に稼働状況を合成する(
  キャラ一覧: readonly キャラDTO[],
  稼働一覧: readonly 稼働表明DTO[],
): readonly キャラ稼働合成[] {
  const 稼働状態マップ = new Map(稼働一覧.map((表明) => [表明.名前, 表明.状態] as const));
  return キャラ一覧.map((キャラ) => ({
    キャラ,
    稼働状態: 稼働状態マップ.get(キャラ.名前) ?? null,
  }));
}
