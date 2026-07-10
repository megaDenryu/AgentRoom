import type { FastifyInstance } from "fastify";
import { エージェント名 } from "../domain/エージェント名.js";
import { ルームID } from "../domain/ルームID.js";
import { 検証エラー } from "../domain/検証エラー.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import type { 新着通知ハブ } from "../infra/新着通知ハブ.js";
import { 新着を待つ } from "./新着待機.js";

const 取得上限デフォルト = 100;
const 待機タイムアウトデフォルトミリ秒 = 60_000;
const 待機タイムアウト上限ミリ秒 = 300_000;

interface ルームパス {
  roomId: string;
}

// リクエストボディは外部境界なのでunknownで受けてここで絞る
function 送信内容に絞る(ボディ: unknown): { 送信者: string; 本文: string } {
  if (
    typeof ボディ === "object" &&
    ボディ !== null &&
    "送信者" in ボディ &&
    typeof ボディ.送信者 === "string" &&
    "本文" in ボディ &&
    typeof ボディ.本文 === "string"
  ) {
    return { 送信者: ボディ.送信者, 本文: ボディ.本文 };
  }
  throw new 検証エラー('ボディは { "送信者": string, "本文": string } である必要があります');
}

function 数値クエリを読む(値: string | undefined, デフォルト: number): number {
  if (値 === undefined) return デフォルト;
  const 数値 = Number(値);
  if (!Number.isInteger(数値) || 数値 < 0) {
    throw new 検証エラー(`0以上の整数である必要があります: "${値}"`);
  }
  return 数値;
}

export function ルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア; ハブ: 新着通知ハブ },
): void {
  const { ストア, ハブ } = 依存;

  app.get("/api/health", async () => ({ ok: true }));

  app.get("/api/rooms", async () => ストア.ルーム一覧を取得する());

  app.post<{ Params: ルームパス }>(
    "/api/rooms/:roomId/messages",
    async (request, reply) => {
      const ルーム = ルームID.create(request.params.roomId);
      const 内容 = 送信内容に絞る(request.body);
      const メッセージ = ストア.追加する(
        ルーム,
        エージェント名.create(内容.送信者),
        内容.本文,
      );
      ハブ.通知する(メッセージ);
      return reply.code(201).send(メッセージ);
    },
  );

  app.get<{ Params: ルームパス; Querystring: { after?: string; limit?: string } }>(
    "/api/rooms/:roomId/messages",
    async (request) => {
      const ルーム = ルームID.create(request.params.roomId);
      const 基準連番 = 数値クエリを読む(request.query.after, 0);
      const 上限 = 数値クエリを読む(request.query.limit, 取得上限デフォルト);
      return ストア.以降を取得する(ルーム, 基準連番, 上限);
    },
  );

  app.get<{ Params: ルームパス }>(
    "/api/rooms/:roomId/latest-seq",
    async (request) => {
      const ルーム = ルームID.create(request.params.roomId);
      return { 最終連番: ストア.最終連番を取得する(ルーム) };
    },
  );

  app.get<{
    Params: ルームパス;
    Querystring: { after?: string; timeoutMs?: string };
  }>("/api/rooms/:roomId/messages/wait", async (request) => {
    const ルーム = ルームID.create(request.params.roomId);
    const 基準連番 = 数値クエリを読む(request.query.after, 0);
    const タイムアウトミリ秒 = Math.min(
      数値クエリを読む(request.query.timeoutMs, 待機タイムアウトデフォルトミリ秒),
      待機タイムアウト上限ミリ秒,
    );
    const 結果 = await 新着を待つ({
      ストア,
      ハブ,
      ルーム,
      基準連番,
      タイムアウトミリ秒,
      取得上限: 取得上限デフォルト,
    });
    if (結果.種別 === "タイムアウト") {
      return { 種別: "タイムアウト", 基準連番 };
    }
    return { 種別: "新着あり", メッセージ一覧: 結果.メッセージ一覧 };
  });

  // クライアント起因の不正入力（検証エラー）だけを400に写像する。
  // それ以外の例外はサーバー側のバグとしてFastifyのデフォルト処理（500）に任せる
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof 検証エラー) {
      return reply.code(400).send({ エラー: error.message });
    }
    return reply.send(error);
  });
}
