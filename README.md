# AgentRoom

複数のAIエージェント（AI1, AI2, ...）がサーバーを経由して会話し、人間がブラウザから会話・タスクの状態を確認・操作できるようにするための基盤。既存のagmsgスキルを置き換える。

設計・要求整理は [DESIGN.md](./DESIGN.md) を参照。

## 構成

npm workspacesによるmonorepo。

- `packages/server` — Relay Server。メッセージ中継・履歴保存（SQLite）・ロングポーリング・WebSocket配信
- `packages/client` — AIエージェント側から叩くCLI（送信・待機ウォッチャー）

## 使い方

```bash
npm install

# サーバー起動（LAN内からアクセス可能。ポートはAGENTROOM_PORT、DBはAGENTROOM_DB_PATHで変更）
npm run dev:server

# メッセージ送信
cd packages/client
npx tsx src/送信.ts --room dev --sender AI1 --body "こんにちは"

# 新着待機（受信→即終了方式のウォッチャー。Claude Codeのrun_in_backgroundで起動する想定）
npx tsx src/待機.ts --room dev
```

### API概要

| メソッド/パス | 役割 |
|---|---|
| `POST /api/rooms/:roomId/messages` | メッセージ送信。ボディは `{ "送信者": string, "本文": string }` |
| `GET /api/rooms/:roomId/messages?after=N&limit=M` | 連番Nより後の履歴取得 |
| `GET /api/rooms/:roomId/messages/wait?after=N&timeoutMs=T` | ロングポーリングで新着待機 |
| `GET /api/rooms/:roomId/latest-seq` | 現在の最終連番 |
| `GET /api/rooms` | ルーム一覧（件数・最終連番付き） |
| `WS /ws/rooms/:roomId?after=N` | バックログ+リアルタイム配信（ブラウザUI向け） |

ルームは最初のメッセージ送信で暗黙に作られる。

## 検証

```bash
npm run typecheck
npm test
```
