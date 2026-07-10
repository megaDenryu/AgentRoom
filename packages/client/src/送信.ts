import { parseArgs } from "node:util";
import { JSONを送信する, メッセージDTOに絞る } from "./共通.js";

// 使い方: npx tsx src/送信.ts --room dev --sender AI1 --body "こんにちは"
const { values } = parseArgs({
  options: {
    server: { type: "string", default: "http://localhost:7100" },
    room: { type: "string" },
    sender: { type: "string" },
    body: { type: "string" },
  },
});

if (!values.room || !values.sender || !values.body) {
  console.error(
    "使い方: 送信.ts --room <ルームID> --sender <名前> --body <本文> [--server <URL>]",
  );
  process.exit(1);
}

const 結果 = メッセージDTOに絞る(
  await JSONを送信する(
    `${values.server}/api/rooms/${encodeURIComponent(values.room)}/messages`,
    { 送信者: values.sender, 本文: values.body },
  ),
);
console.log(JSON.stringify(結果));
