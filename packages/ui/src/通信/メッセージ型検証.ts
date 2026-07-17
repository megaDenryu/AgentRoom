import type { メッセージDTO, メンバーDTO, ルーム概要DTO, 未読情報DTO, 稼働表明DTO } from "./メッセージ型";

export function メッセージDTOか(v: unknown): v is メッセージDTO {
  return typeof v === "object" && v !== null &&
    "連番" in v && typeof v.連番 === "number" && "ルームID" in v && typeof v.ルームID === "string" &&
    "送信者" in v && typeof v.送信者 === "string" && "本文" in v && typeof v.本文 === "string" &&
    "送信時刻" in v && typeof v.送信時刻 === "string" &&
    "宛先" in v && (v.宛先 === null || typeof v.宛先 === "string");
}
export function ルーム概要DTOか(v: unknown): v is ルーム概要DTO {
  return typeof v === "object" && v !== null &&
    "ルームID" in v && typeof v.ルームID === "string" && "メッセージ数" in v && typeof v.メッセージ数 === "number" &&
    "最終連番" in v && typeof v.最終連番 === "number" && "最終送信時刻" in v && typeof v.最終送信時刻 === "string" &&
    "未読数" in v && typeof v.未読数 === "number";
}
export function メンバーDTOか(v: unknown): v is メンバーDTO {
  return typeof v === "object" && v !== null && "名前" in v && typeof v.名前 === "string" &&
    "種別" in v && typeof v.種別 === "string" && "参加時刻" in v && typeof v.参加時刻 === "string";
}
export function 未読情報DTOか(v: unknown): v is 未読情報DTO {
  return typeof v === "object" && v !== null && "未読数" in v && typeof v.未読数 === "number" &&
    "既読位置" in v && typeof v.既読位置 === "number";
}
export function 稼働表明DTOか(v: unknown): v is 稼働表明DTO {
  return typeof v === "object" && v !== null && "名前" in v && typeof v.名前 === "string" &&
    "状態" in v && typeof v.状態 === "string" && ["稼働中", "待機中", "不明"].includes(v.状態) &&
    "現在の作業" in v && (v.現在の作業 === null || typeof v.現在の作業 === "string") &&
    "札ID" in v && (v.札ID === null || typeof v.札ID === "number") &&
    "更新時刻" in v && typeof v.更新時刻 === "string";
}
