// packaged版Jimboのrenderer(file://で読み込まれるページ)がfetchを送ると、
// ブラウザはOriginヘッダに opaque origin を表す固定文字列 "null" を載せる
// (参照: electron-app/src/main/main.ts の loadFile 経路)。実在のホスト名では
// ないため、URL解析ではなく文字列一致で先に判定する。
const Electronファイルオリジン = "null";

export type オリジン許可判定結果 = "許可" | "拒否";

function ホスト名を取り出す(origin: string): string | undefined {
  try {
    return new URL(origin).hostname;
  } catch {
    return undefined;
  }
}

// Originヘッダの値が、この配信オリジン(自機)からのアクセスとみなせるかを判定する。
// 許可ホスト一覧には呼び出し側があらかじめ localhost・127.0.0.1・自機のNIC IPv4
// アドレスを詰めておく(このモジュールはネットワーク列挙を知らない純粋関数)。
// ホスト名の完全一致のみを許可とし、部分一致(例: "evil-localhost.com")を弾く。
export function オリジンを許可判定する(
  origin: string,
  許可ホスト一覧: readonly string[],
): オリジン許可判定結果 {
  if (origin === Electronファイルオリジン) {
    return "許可";
  }
  const ホスト名 = ホスト名を取り出す(origin);
  if (ホスト名 !== undefined && 許可ホスト一覧.includes(ホスト名)) {
    return "許可";
  }
  return "拒否";
}
