import { 検証エラー } from "../domain/検証エラー.js";

// 各エンドポイントのリクエストボディは外部境界なのでunknownで受けてここで絞る

export function 送信内容に絞る(ボディ: unknown): {
  送信者: string;
  本文: string;
  宛先: string | undefined;
} {
  if (
    typeof ボディ === "object" &&
    ボディ !== null &&
    "送信者" in ボディ &&
    typeof ボディ.送信者 === "string" &&
    "本文" in ボディ &&
    typeof ボディ.本文 === "string"
  ) {
    // 宛先は任意フィールド。省略・null は「全員宛」を意味する
    if (!("宛先" in ボディ) || ボディ.宛先 === null || ボディ.宛先 === undefined) {
      return { 送信者: ボディ.送信者, 本文: ボディ.本文, 宛先: undefined };
    }
    if (typeof ボディ.宛先 === "string") {
      return { 送信者: ボディ.送信者, 本文: ボディ.本文, 宛先: ボディ.宛先 };
    }
  }
  throw new 検証エラー(
    'ボディは { "送信者": string, "本文": string, "宛先"?: string } である必要があります',
  );
}

export function メンバー登録内容に絞る(ボディ: unknown): { 種別: string } {
  if (
    typeof ボディ === "object" &&
    ボディ !== null &&
    "種別" in ボディ &&
    typeof ボディ.種別 === "string"
  ) {
    return { 種別: ボディ.種別 };
  }
  throw new 検証エラー('ボディは { "種別": string } である必要があります');
}

export function 既読位置更新内容に絞る(ボディ: unknown): { 読者: string; 連番: number } {
  if (
    typeof ボディ === "object" &&
    ボディ !== null &&
    "読者" in ボディ &&
    typeof ボディ.読者 === "string" &&
    "連番" in ボディ &&
    typeof ボディ.連番 === "number"
  ) {
    return { 読者: ボディ.読者, 連番: ボディ.連番 };
  }
  throw new 検証エラー('ボディは { "読者": string, "連番": number } である必要があります');
}

export function 数値クエリを読む(値: string | undefined, デフォルト: number): number {
  if (値 === undefined) return デフォルト;
  const 数値 = Number(値);
  if (!Number.isInteger(数値) || 数値 < 0) {
    throw new 検証エラー(`0以上の整数である必要があります: "${値}"`);
  }
  return 数値;
}
