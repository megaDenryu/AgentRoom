// Relay Server との通信境界の型。サーバー側の toJSON 形状
// （packages/server/src/domain/メッセージ.ts / ルーム概要.ts）と対応する。
// 外部境界なので unknown で受けて型ガードで絞る

export interface メッセージDTO {
  readonly 連番: number;
  readonly ルームID: string;
  readonly 送信者: string;
  readonly 本文: string;
  readonly 送信時刻: string;
}

export interface ルーム概要DTO {
  readonly ルームID: string;
  readonly メッセージ数: number;
  readonly 最終連番: number;
  readonly 最終送信時刻: string;
}

export function メッセージDTOか(値: unknown): 値 is メッセージDTO {
  return (
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
  );
}

export function ルーム概要DTOか(値: unknown): 値 is ルーム概要DTO {
  return (
    typeof 値 === "object" &&
    値 !== null &&
    "ルームID" in 値 &&
    typeof 値.ルームID === "string" &&
    "メッセージ数" in 値 &&
    typeof 値.メッセージ数 === "number" &&
    "最終連番" in 値 &&
    typeof 値.最終連番 === "number" &&
    "最終送信時刻" in 値 &&
    typeof 値.最終送信時刻 === "string"
  );
}
