import type { FastifyInstance } from "fastify";
import { 検証エラー } from "../domain/検証エラー.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import type { 新着通知ハブ } from "../infra/新着通知ハブ.js";
import { 既読ルートを登録する } from "./既読ルート.js";
import { メッセージルートを登録する } from "./メッセージルート.js";
import { メンバールートを登録する } from "./メンバールート.js";
import { 稼働ルートを登録する } from "./稼働ルート.js";

// APIルート全体の配線係。責務ごとに分けたルート登録関数を束ねる
export function ルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア; ハブ: 新着通知ハブ },
): void {
  // serviceフィールドは、ヘルスチェック元(埋め込みホスト側)が「200を返す別プロセス」と
  // 「本物のAgentRoom」を区別するための識別子。okだけでは無関係なプロセスの相乗りを
  // 検知できない
  app.get("/api/health", async () => ({ ok: true, service: "agentroom" }));

  メッセージルートを登録する(app, 依存);
  メンバールートを登録する(app, 依存);
  既読ルートを登録する(app, 依存);
  稼働ルートを登録する(app, 依存);

  // クライアント起因の不正入力（検証エラー）だけを400に写像する。
  // それ以外の例外はサーバー側のバグとしてFastifyのデフォルト処理（500）に任せる
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof 検証エラー) {
      return reply.code(400).send({ エラー: error.message });
    }
    return reply.send(error);
  });
}
