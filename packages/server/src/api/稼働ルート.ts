import type { FastifyInstance } from "fastify";
import { エージェント名 } from "../domain/エージェント名.js";
import { 参照札ID } from "../domain/参照札ID.js";
import { 現在の作業内容 } from "../domain/現在の作業内容.js";
import { 稼働状態 } from "../domain/稼働状態.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import { 稼働表明更新内容に絞る } from "./リクエスト検証.js";
import type { 稼働表明パス } from "./ルートパス型.js";

// 稼働表明（ワークスペース直下、ルーム非所属）の登録・一覧取得を担うルート群。
// 参照: DESIGN.md 11章 Phase B「エージェント稼働の可視化」
export function 稼働ルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア },
): void {
  const { ストア } = 依存;

  app.put<{ Params: 稼働表明パス }>(
    "/api/presence/:name",
    async (request) => {
      const 名前 = エージェント名.create(request.params.name);
      const 内容 = 稼働表明更新内容に絞る(request.body);
      const 更新後 = ストア.稼働を更新する(
        名前,
        稼働状態.create(内容.状態),
        現在の作業内容.create(内容.現在の作業),
        参照札ID.create(内容.札ID),
      );
      return 更新後.toJSON(Date.now());
    },
  );

  app.get("/api/presence", async () => {
    const 基準時刻ミリ秒 = Date.now();
    return ストア.稼働一覧を取得する().map((表明) => 表明.toJSON(基準時刻ミリ秒));
  });
}
