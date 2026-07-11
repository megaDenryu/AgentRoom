import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import fastifyStatic from "@fastify/static";
import websocket from "@fastify/websocket";
import Fastify, { type FastifyInstance } from "fastify";
import { WSルートを登録する } from "./api/wsルート.js";
import { ルートを登録する } from "./api/ルート.js";
import { メッセージストア } from "./infra/メッセージストア.js";
import { 新着通知ハブ } from "./infra/新着通知ハブ.js";

export interface AgentRoomサーバー設定 {
  readonly ポート: number;
  readonly DBパス: string;
  readonly UI配信ディレクトリ: string;
}

// 起動成功時はFastifyインスタンスを返し、呼び出し側(埋め込みホスト)が
// プロセス終了時に app.close() 等で寿命を管理できるようにする
export type AgentRoomサーバー起動結果 =
  | { readonly 種別: "成功"; readonly app: FastifyInstance }
  | { readonly 種別: "失敗"; readonly 原因: string };

// コンポジションルート。単体CLI起動(index.ts)からも、他プロセス埋め込み
// (MonogatariAI等のホストアプリがElectron mainプロセス内で呼ぶ)からも
// 同じ手順で起動できるよう、依存の生成と配線をこの関数1つに閉じる。
export async function AgentRoomサーバーを起動する(
  設定: AgentRoomサーバー設定,
): Promise<AgentRoomサーバー起動結果> {
  try {
    mkdirSync(path.dirname(設定.DBパス), { recursive: true });
    const ストア = メッセージストア.ファイルから開く(設定.DBパス);
    const ハブ = new 新着通知ハブ();

    const app = Fastify({ logger: true });
    await app.register(websocket);
    ルートを登録する(app, { ストア, ハブ });
    WSルートを登録する(app, { ストア, ハブ });

    // ブラウザUI（packages/ui）のビルド成果物があればルート(/)から静的配信する。
    // distが無くてもサーバー起動は成立させる（UIをビルドしない開発運用を許容する）
    if (existsSync(path.join(設定.UI配信ディレクトリ, "index.html"))) {
      await app.register(fastifyStatic, { root: 設定.UI配信ディレクトリ });
    } else {
      app.log.info(`UIのdistが無いため静的配信をスキップします: ${設定.UI配信ディレクトリ}`);
    }

    // LAN内のスマホ・タブレットからアクセスできるよう0.0.0.0にバインドする。
    // 参照: DESIGN.md 5章 確定済み判断11
    await app.listen({ port: 設定.ポート, host: "0.0.0.0" });
    return { 種別: "成功", app };
  } catch (error) {
    return { 種別: "失敗", 原因: error instanceof Error ? error.message : String(error) };
  }
}
