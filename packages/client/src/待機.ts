import { parseArgs } from "node:util";
import {
  JSONを取得する,
  新着待機レスポンスに絞る,
  最終連番に絞る,
  type メッセージDTO,
} from "./共通.js";

// 「受信→即終了」方式のウォッチャー本体。Claude Codeセッションが
// `Bash run_in_background` でこれを起動してターンを終えると、新着到着による
// プロセス終了通知でセッションが自動再開される。参照: DESIGN.md 9.1
//
// 使い方: npx tsx src/待機.ts --room dev [--for AI1] [--after 0] [--total-timeout-ms 600000]
// --for <名前> を指定すると「自分の発言」と「他人個別宛のメッセージ」を無視して待機を続け、
// 全員宛または自分宛のメッセージが来たときだけ終了する
// 終了コード: 0=新着を受信して標準出力にJSON行で出力した / 2=総タイムアウト
const { values } = parseArgs({
  options: {
    server: { type: "string", default: "http://localhost:7100" },
    room: { type: "string" },
    for: { type: "string" },
    after: { type: "string" },
    "total-timeout-ms": { type: "string", default: "600000" },
  },
});

if (!values.room) {
  console.error(
    "使い方: 待機.ts --room <ルームID> [--for <自分の名前>] [--after <連番>] [--server <URL>] [--total-timeout-ms <ミリ秒>]",
  );
  process.exit(1);
}

const サーバー = values.server;
const ルーム = encodeURIComponent(values.room);
const 自分 = values.for;
const 総タイムアウトミリ秒 = Number(values["total-timeout-ms"]);
const ポーリング1回ミリ秒 = 60_000;

function 自分に届くか(メッセージ: メッセージDTO): boolean {
  if (自分 === undefined) return true;
  if (メッセージ.送信者 === 自分) return false;
  return メッセージ.宛先 === null || メッセージ.宛先 === 自分;
}

// --after未指定は「これから来るものを待つ」。現在の最終連番を基準にする
let 基準連番 =
  values.after !== undefined
    ? Number(values.after)
    : 最終連番に絞る(
        await JSONを取得する(`${サーバー}/api/rooms/${ルーム}/latest-seq`),
      );

const 期限 = Date.now() + 総タイムアウトミリ秒;
while (Date.now() < 期限) {
  const 残りミリ秒 = Math.min(ポーリング1回ミリ秒, 期限 - Date.now());
  const 結果 = 新着待機レスポンスに絞る(
    await JSONを取得する(
      `${サーバー}/api/rooms/${ルーム}/messages/wait?after=${基準連番}&timeoutMs=${残りミリ秒}`,
    ),
  );
  if (結果.種別 === "新着あり") {
    // 対象外メッセージしか無くても基準連番は進める（同じメッセージを再受信し続けないため）
    for (const メッセージ of 結果.メッセージ一覧) {
      if (メッセージ.連番 > 基準連番) 基準連番 = メッセージ.連番;
    }
    const 対象 = 結果.メッセージ一覧.filter(自分に届くか);
    if (対象.length > 0) {
      for (const メッセージ of 対象) {
        console.log(JSON.stringify(メッセージ));
      }
      process.exit(0);
    }
  }
}

console.error(`総タイムアウト: ${総タイムアウトミリ秒}ミリ秒の間に新着はありませんでした`);
process.exit(2);
