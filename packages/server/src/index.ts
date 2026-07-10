import { mkdirSync } from "node:fs";
import path from "node:path";
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

// LAN内のスマホ・タブレットからアクセスできるよう0.0.0.0にバインドする。
// 参照: DESIGN.md 5章 確定済み判断11
await app.listen({ port: ポート, host: "0.0.0.0" });
