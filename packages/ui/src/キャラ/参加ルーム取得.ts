import type { Relayクライアント } from "../通信/Relayクライアント";
import type { メンバーDTO } from "../通信/メッセージ型";
import { 参加ルームを逆引きする } from "./参加ルーム逆引き";

// GET /api/rooms でルーム一覧を取得し、各ルームごとに GET /api/rooms/:roomId/members を
// 呼んでメンバーマップを組み立ててから逆引きする。参加ルームを横断取得する専用APIが無いための
// 既存API組み合わせ実装(N+1 fetchになるが、ルーム数が多い運用は想定しないため許容する)
export async function 参加ルームマップを取得する(
  クライアント: Relayクライアント,
): Promise<ReadonlyMap<string, readonly string[]>> {
  const ルーム一覧 = await クライアント.ルーム一覧を取得する();
  const メンバー一覧一覧 = await Promise.all(
    ルーム一覧.map((ルーム) => クライアント.メンバー一覧を取得する(ルーム.ルームID)),
  );
  const メンバーマップ = new Map<string, readonly メンバーDTO[]>(
    ルーム一覧.map(
      (ルーム, インデックス) => [ルーム.ルームID, メンバー一覧一覧[インデックス]] as const,
    ),
  );
  return 参加ルームを逆引きする(ルーム一覧, メンバーマップ);
}

// 参加ルーム取得はルーム数ぶんのN+1 fetchで失敗しやすい。デスクトップのキャラタブサービス・
// モバイルのキャラ一覧ビューサービスの双方が使う共通のサイレントフォールバック(空Map=参加ルーム
// 欄なし)であり、失敗してもキャラ一覧自体の表示は壊さない
export async function 参加ルームマップを安全に取得する(
  クライアント: Relayクライアント,
): Promise<ReadonlyMap<string, readonly string[]>> {
  try {
    return await 参加ルームマップを取得する(クライアント);
  } catch {
    return new Map();
  }
}
