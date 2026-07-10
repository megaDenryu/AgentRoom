// Claude Codeセッションから叩く薄いHTTPクライアント。サーバー側の型定義に
// 依存させない（このパッケージ単体でコピーして持ち運べる状態を保つ）ため、
// レスポンスはunknownで受けてここで絞る

export interface メッセージDTO {
  readonly 連番: number;
  readonly ルームID: string;
  readonly 送信者: string;
  readonly 本文: string;
  readonly 送信時刻: string;
}

export function メッセージDTOに絞る(値: unknown): メッセージDTO {
  if (
    typeof 値 === "object" &&
    値 !== null &&
    "連番" in 値 &&
    typeof 値.連番 === "number" &&
    "ルームID" in 値 &&
    typeof 値.ルームID === "string" &&
    "送信者" in 値 &&
    typeof 値.送信者 === "string" &&
    "本文" in 値 &&
    typeof 値.本文 === "string" &&
    "送信時刻" in 値 &&
    typeof 値.送信時刻 === "string"
  ) {
    return {
      連番: 値.連番,
      ルームID: 値.ルームID,
      送信者: 値.送信者,
      本文: 値.本文,
      送信時刻: 値.送信時刻,
    };
  }
  throw new Error(`メッセージの形式が想定と一致しません: ${JSON.stringify(値)}`);
}

export type 新着待機レスポンス =
  | { 種別: "新着あり"; メッセージ一覧: メッセージDTO[] }
  | { 種別: "タイムアウト" };

export function 新着待機レスポンスに絞る(値: unknown): 新着待機レスポンス {
  if (typeof 値 === "object" && 値 !== null && "種別" in 値) {
    if (値.種別 === "タイムアウト") {
      return { 種別: "タイムアウト" };
    }
    if (
      値.種別 === "新着あり" &&
      "メッセージ一覧" in 値 &&
      Array.isArray(値.メッセージ一覧)
    ) {
      return {
        種別: "新着あり",
        メッセージ一覧: 値.メッセージ一覧.map(メッセージDTOに絞る),
      };
    }
  }
  throw new Error(`新着待機レスポンスの形式が想定と一致しません: ${JSON.stringify(値)}`);
}

export async function JSONを取得する(url: string): Promise<unknown> {
  const レスポンス = await fetch(url);
  if (!レスポンス.ok) {
    throw new Error(`GET ${url} が失敗しました: ${レスポンス.status} ${await レスポンス.text()}`);
  }
  return レスポンス.json();
}

export async function JSONを送信する(url: string, ボディ: unknown): Promise<unknown> {
  const レスポンス = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(ボディ),
  });
  if (!レスポンス.ok) {
    throw new Error(`POST ${url} が失敗しました: ${レスポンス.status} ${await レスポンス.text()}`);
  }
  return レスポンス.json();
}

export function 最終連番に絞る(値: unknown): number {
  if (
    typeof 値 === "object" &&
    値 !== null &&
    "最終連番" in 値 &&
    typeof 値.最終連番 === "number"
  ) {
    return 値.最終連番;
  }
  throw new Error(`latest-seqレスポンスの形式が想定と一致しません: ${JSON.stringify(値)}`);
}
