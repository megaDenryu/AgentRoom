import type { FastifyInstance } from "fastify";
import { エージェント名 } from "../domain/エージェント名.js";
import { ルームID } from "../domain/ルームID.js";
import { 検証エラー } from "../domain/検証エラー.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import { 既読位置更新内容に絞る } from "./リクエスト検証.js";
import type { ルームパス } from "./ルートパス型.js";

// 既読位置の更新・未読数取得を担うルート群。既読は明示APIでのみ進む
// （履歴取得やロングポーリングの副作用では動かない）。参照: DESIGN.md 10章
export function 既読ルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア },
): void {
  const { ストア } = 依存;

  app.put<{ Params: ルームパス }>(
    "/api/rooms/:roomId/read-position",
    async (request) => {
      const ルーム = ルームID.create(request.params.roomId);
      const 内容 = 既読位置更新内容に絞る(request.body);
      const 既読位置 = ストア.既読位置を進める(
        ルーム,
        エージェント名.create(内容.読者),
        内容.連番,
      );
      return { 既読位置 };
    },
  );

  app.get<{ Params: ルームパス; Querystring: { reader?: string } }>(
    "/api/rooms/:roomId/unread",
    async (request) => {
      if (request.query.reader === undefined) {
        throw new 検証エラー("readerクエリパラメータは必須です");
      }
      const ルーム = ルームID.create(request.params.roomId);
      const 読者 = エージェント名.create(request.query.reader);
      return {
        未読数: ストア.未読数を数える(ルーム, 読者),
        既読位置: ストア.既読位置を取得する(ルーム, 読者),
      };
    },
  );
}
