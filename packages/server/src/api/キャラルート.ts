import type { FastifyInstance } from "fastify";
import { アイコンDataUrl } from "../domain/アイコンDataUrl.js";
import { エージェント名 } from "../domain/エージェント名.js";
import { キャラ種別 } from "../domain/キャラ種別.js";
import { キャラプロンプト } from "../domain/キャラプロンプト.js";
import { 行動パターンメモ } from "../domain/行動パターンメモ.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import { キャラ登録内容に絞る } from "./リクエスト検証.js";
import type { キャラパス } from "./ルートパス型.js";

// キャラ（人物）台帳の登録・削除・一覧取得を担うルート群。ワークスペース直下
// （ルーム非所属）の第一級エンティティとして扱う。参照: 札#35「方針修正」・札#36
export function キャラルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア },
): void {
  const { ストア } = 依存;

  app.put<{ Params: キャラパス }>(
    "/api/charas/:name",
    async (request) => {
      const 名前 = エージェント名.create(request.params.name);
      const 内容 = キャラ登録内容に絞る(request.body);
      const 更新後 = ストア.キャラを作成または更新する(
        名前,
        キャラ種別.create(内容.種別),
        キャラプロンプト.create(内容.プロンプト),
        アイコンDataUrl.create(内容.アイコンdataUrl),
        行動パターンメモ.create(内容.行動パターンメモ),
        エージェント名.create(内容.作成者),
      );
      return 更新後.toJSON();
    },
  );

  app.delete<{ Params: キャラパス }>(
    "/api/charas/:name",
    async (request, reply) => {
      const 名前 = エージェント名.create(request.params.name);
      ストア.キャラを削除する(名前);
      return reply.code(204).send();
    },
  );

  app.get("/api/charas", async () => {
    return ストア.キャラ一覧を取得する().map((キャラ) => キャラ.toJSON());
  });
}
