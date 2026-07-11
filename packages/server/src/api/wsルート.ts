import type { FastifyInstance } from "fastify";
import { ルームID } from "../domain/ルームID.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import type { 新着通知ハブ } from "../infra/新着通知ハブ.js";
import type { ルームパス } from "./ルートパス型.js";

const バックログ上限 = 200;

// ブラウザUI向けのpushチャンネル。接続時に ?after=N 以降のバックログを流し、
// 以降は新着をリアルタイム配信する。1フレーム=1メッセージのJSON
export function WSルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア; ハブ: 新着通知ハブ },
): void {
  const { ストア, ハブ } = 依存;

  app.get<{ Params: ルームパス; Querystring: { after?: string } }>(
    "/ws/rooms/:roomId",
    { websocket: true },
    (socket, request) => {
      const ルーム = ルームID.create(request.params.roomId);
      const 基準連番 = Number(request.query.after ?? "0");

      for (const メッセージ of ストア.以降を取得する(
        ルーム,
        Number.isInteger(基準連番) && 基準連番 >= 0 ? 基準連番 : 0,
        バックログ上限,
      )) {
        socket.send(JSON.stringify(メッセージ));
      }

      const 購読解除 = ハブ.購読する(ルーム, (メッセージ) => {
        socket.send(JSON.stringify(メッセージ));
      });
      socket.on("close", 購読解除);
      socket.on("error", 購読解除);
    },
  );
}
