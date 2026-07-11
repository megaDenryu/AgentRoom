import path from "node:path";
import { AgentRoomサーバーを起動する } from "./サーバー起動.js";

// CLI実行時のみのコンポジションルート。環境変数から設定を組み立てて
// AgentRoomサーバーを起動する薄いエントリ。他プロセスへの埋め込みは
// サーバー起動.ts の AgentRoomサーバーを起動する() を直接呼ぶ(index.tsは経由しない)。
const ポート = Number(process.env["AGENTROOM_PORT"] ?? "7100");
const DBパス =
  process.env["AGENTROOM_DB_PATH"] ??
  path.join(import.meta.dirname, "..", "data", "agentroom.sqlite3");
const UI配信ディレクトリ = path.join(import.meta.dirname, "..", "..", "ui", "dist");

const 結果 = await AgentRoomサーバーを起動する({ ポート, DBパス, UI配信ディレクトリ });
if (結果.種別 === "失敗") {
  console.error(`AgentRoomサーバーの起動に失敗しました: ${結果.原因}`);
  process.exit(1);
}
