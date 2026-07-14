import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import fastifyStatic from "@fastify/static";
import websocket from "@fastify/websocket";
import Fastify, { type FastifyInstance } from "fastify";
import { WSルートを登録する } from "./api/wsルート.js";
import { ルートを登録する } from "./api/ルート.js";
import { オリジンを許可判定する } from "./domain/オリジン許可判定.js";
import { 自機のIPv4アドレス一覧を取得する } from "./infra/自機IPv4アドレス一覧.js";
import { メッセージストア } from "./infra/メッセージストア.js";
import { 新着通知ハブ } from "./infra/新着通知ハブ.js";

export interface AgentRoomサーバー設定 {
  readonly ポート: number;
  readonly DBパス: string;
  readonly UI配信ディレクトリ: string;
  // ホスト側(埋め込み先)が、AgentRoomの知らない他住民(Fudaba等)のルートを
  // 間借りさせるためのフック。AgentRoomはこの関数群の中身を一切知らない
  // (参照: Jimbo/ARCHITECTURE.md「住民の実装形態」)。
  readonly 追加ルート登録関数一覧?: readonly ((app: FastifyInstance) => void)[];
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

    // AgentRoomはLAN内の別ホスト・別ポートのアプリ(Jimbo electron-app renderer等)から
    // 直接fetchされる前提のワークスペースサーバー(参照: 札#35「方針修正」)。LAN公開のため
    // 全オリジン許可は悪意あるWebページからのlocalhost読み書きを許す攻撃面になる
    // (参照: 札#43)。Originヘッダが無いリクエスト(curl・MCP・サーバー間)はブラウザの
    // CORS機構が関与しないため素通しし、Originがある場合のみ自機由来かを検査する
    // (依存追加を避けるため@fastify/corsは使わずhookで自前実装)
    const 許可ホスト一覧 = ["localhost", "127.0.0.1", ...自機のIPv4アドレス一覧を取得する()];
    app.addHook("onRequest", async (request, reply) => {
      const オリジン = request.headers.origin;
      if (オリジン !== undefined && オリジンを許可判定する(オリジン, 許可ホスト一覧) === "許可") {
        reply.header("Access-Control-Allow-Origin", オリジン);
        reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Content-Type");
        reply.header("Vary", "Origin");
      }
      if (request.method === "OPTIONS") {
        reply.code(204).send();
      }
    });

    ルートを登録する(app, { ストア, ハブ });
    WSルートを登録する(app, { ストア, ハブ });
    for (const 登録する of 設定.追加ルート登録関数一覧 ?? []) {
      登録する(app);
    }

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
