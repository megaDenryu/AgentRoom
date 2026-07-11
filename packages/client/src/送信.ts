import { parseArgs } from "node:util";
import { JSONを送信する, メッセージDTOに絞る } from "./共通.js";

// 使い方: npx tsx src/送信.ts --room dev --sender AI1 --body "こんにちは" [--to AI2]
// --to を省略すると全員宛になる
const { values } = parseArgs({
  options: {
    server: { type: "string", default: "http://localhost:7100" },
    room: { type: "string" },
    sender: { type: "string" },
    body: { type: "string" },
    to: { type: "string" },
  },
});

if (!values.room || !values.sender || !values.body) {
  console.error(
    "使い方: 送信.ts --room <ルームID> --sender <名前> --body <本文> [--to <宛先名>] [--server <URL>]",
  );
  process.exit(1);
}

const ボディ: { 送信者: string; 本文: string; 宛先?: string } = {
  送信者: values.sender,
  本文: values.body,
};
if (values.to !== undefined) {
  ボディ.宛先 = values.to;
}

const 結果 = メッセージDTOに絞る(
  await JSONを送信する(
    `${values.server}/api/rooms/${encodeURIComponent(values.room)}/messages`,
    ボディ,
  ),
);
console.log(JSON.stringify(結果));
