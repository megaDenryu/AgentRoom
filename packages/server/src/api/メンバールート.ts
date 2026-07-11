import type { FastifyInstance } from "fastify";
import { エージェント名 } from "../domain/エージェント名.js";
import { エージェント種別 } from "../domain/エージェント種別.js";
import { ルームID } from "../domain/ルームID.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import { メンバー登録内容に絞る } from "./リクエスト検証.js";
import type { メンバーパス, ルームパス } from "./ルートパス型.js";

// メンバー台帳（参加/離脱/一覧）を担うルート群。参加はPUTで冪等
export function メンバールートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア },
): void {
  const { ストア } = 依存;

  app.put<{ Params: メンバーパス }>(
    "/api/rooms/:roomId/members/:name",
    async (request) => {
      const ルーム = ルームID.create(request.params.roomId);
      const 名前 = エージェント名.create(request.params.name);
      const 内容 = メンバー登録内容に絞る(request.body);
      return ストア.メンバーを登録する(ルーム, 名前, エージェント種別.create(内容.種別));
    },
  );

  app.delete<{ Params: メンバーパス }>(
    "/api/rooms/:roomId/members/:name",
    async (request, reply) => {
      const ルーム = ルームID.create(request.params.roomId);
      const 名前 = エージェント名.create(request.params.name);
      ストア.メンバーを削除する(ルーム, 名前);
      return reply.code(204).send();
    },
  );

  app.get<{ Params: ルームパス }>(
    "/api/rooms/:roomId/members",
    async (request) => {
      const ルーム = ルームID.create(request.params.roomId);
      return ストア.メンバー一覧を取得する(ルーム);
    },
  );
}
