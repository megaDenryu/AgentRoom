import type { FastifyInstance } from "fastify";
import { エージェント名 } from "../domain/エージェント名.js";
import { ルームID } from "../domain/ルームID.js";
import { 個別宛, 全員宛, type 宛先 } from "../domain/宛先.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import type { 新着通知ハブ } from "../infra/新着通知ハブ.js";
import { 新着を待つ } from "./新着待機.js";
import { 数値クエリを読む, 送信内容に絞る } from "./リクエスト検証.js";
import type { ルームパス } from "./ルートパス型.js";

const 取得上限デフォルト = 100;
const 待機タイムアウトデフォルトミリ秒 = 60_000;
const 待機タイムアウト上限ミリ秒 = 300_000;

// メッセージの送信・履歴取得・ロングポーリングを担うルート群
export function メッセージルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア; ハブ: 新着通知ハブ },
): void {
  const { ストア, ハブ } = 依存;

  app.get<{ Querystring: { reader?: string } }>("/api/rooms", async (request) => {
    const 読者 =
      request.query.reader === undefined
        ? null
        : エージェント名.create(request.query.reader);
    return ストア.ルーム一覧を取得する(読者);
  });

  app.post<{ Params: ルームパス }>(
    "/api/rooms/:roomId/messages",
    async (request, reply) => {
      const ルーム = ルームID.create(request.params.roomId);
      const 内容 = 送信内容に絞る(request.body);
      const 宛先指定: 宛先 =
        内容.宛先 === undefined ? 全員宛 : 個別宛(エージェント名.create(内容.宛先));
      const メッセージ = ストア.追加する(
        ルーム,
        エージェント名.create(内容.送信者),
        内容.本文,
        宛先指定,
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
}
