import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import fastifyStatic from "@fastify/static";
import websocket from "@fastify/websocket";
import Fastify from "fastify";
import { WSルートを登録する } from "./api/wsルート.js";
import { ルートを登録する } from "./api/ルート.js";
import { メッセージストア } from "./infra/メッセージストア.js";
import { 新着通知ハブ } from "./infra/新着通知ハブ.js";

// コンポジションルート。依存の生成と配線はここに集約する
const ポート = Number(process.env["AGENTROOM_PORT"] ?? "7100");
const DBパス =
  process.env["AGENTROOM_DB_PATH"] ??
  path.join(import.meta.dirname, "..", "data", "agentroom.sqlite3");

mkdirSync(path.dirname(DBパス), { recursive: true });
const ストア = メッセージストア.ファイルから開く(DBパス);
const ハブ = new 新着通知ハブ();

const app = Fastify({ logger: true });
await app.register(websocket);
ルートを登録する(app, { ストア, ハブ });
WSルートを登録する(app, { ストア, ハブ });

// ブラウザUI（packages/ui）のビルド成果物があればルート(/)から静的配信する。
// /api・/ws はワイルドカードより具体的なルートとして優先される。
// distが無くてもサーバー起動は成立させる（UIをビルドしない開発運用を許容する）
const UI配信ディレクトリ = path.join(import.meta.dirname, "..", "..", "ui", "dist");
if (existsSync(path.join(UI配信ディレクトリ, "index.html"))) {
  await app.register(fastifyStatic, { root: UI配信ディレクトリ });
} else {
  app.log.info(`UIのdistが無いため静的配信をスキップします: ${UI配信ディレクトリ}`);
}

// LAN内のスマホ・タブレットからアクセスできるよう0.0.0.0にバインドする。
// 参照: DESIGN.md 5章 確定済み判断11
await app.listen({ port: ポート, host: "0.0.0.0" });
