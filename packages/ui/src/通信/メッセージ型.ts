// Relay Server との通信境界の型。サーバー側の toJSON 形状
// （packages/server/src/domain/メッセージ.ts / ルーム概要.ts / メンバー.ts）と対応する。
// 外部境界なので unknown で受けて型ガードで絞る

export interface メッセージDTO {
  readonly 連番: number;
  readonly ルームID: string;
  readonly 送信者: string;
  readonly 本文: string;
  readonly 送信時刻: string;
  // null=全員宛 / string=そのエージェント個別宛
  readonly 宛先: string | null;
}

export interface ルーム概要DTO {
  readonly ルームID: string;
  readonly メッセージ数: number;
  readonly 最終連番: number;
  readonly 最終送信時刻: string;
  readonly 未読数: number;
}

export interface メンバーDTO {
  readonly 名前: string;
  readonly 種別: string;
  readonly 参加時刻: string;
}

export interface 未読情報DTO {
  readonly 未読数: number;
  readonly 既読位置: number;
}

// サーバー側 domain/稼働表明.ts の表示稼働状態値と対応（申告値+TTL経過の「不明」を含む）
export interface 稼働表明DTO {
  readonly 名前: string;
  readonly 状態: "稼働中" | "待機中" | "不明";
  readonly 現在の作業: string | null;
  readonly 札ID: number | null;
  readonly 更新時刻: string;
}

// サーバー側 domain/エージェント種別.ts の許可値と対応する（メンバー追加フォームの選択肢）
export const エージェント種別一覧 = [
  "human",
  "claude-code",
  "codex",
  "gemini",
  "antigravity",
  "copilot",
  "opencode",
] as const;

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
    typeof 値.送信時刻 === "string" &&
    "宛先" in 値 &&
    (値.宛先 === null || typeof 値.宛先 === "string")
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
    typeof 値.最終送信時刻 === "string" &&
    "未読数" in 値 &&
    typeof 値.未読数 === "number"
  );
}

export function メンバーDTOか(値: unknown): 値 is メンバーDTO {
  return (
    typeof 値 === "object" &&
    値 !== null &&
    "名前" in 値 &&
    typeof 値.名前 === "string" &&
    "種別" in 値 &&
    typeof 値.種別 === "string" &&
    "参加時刻" in 値 &&
    typeof 値.参加時刻 === "string"
  );
}

export function 未読情報DTOか(値: unknown): 値 is 未読情報DTO {
  return (
    typeof 値 === "object" &&
    値 !== null &&
    "未読数" in 値 &&
    typeof 値.未読数 === "number" &&
    "既読位置" in 値 &&
    typeof 値.既読位置 === "number"
  );
}

const 稼働状態値一覧 = ["稼働中", "待機中", "不明"] as const;

export function 稼働表明DTOか(値: unknown): 値 is 稼働表明DTO {
  return (
    typeof 値 === "object" &&
    値 !== null &&
    "名前" in 値 &&
    typeof 値.名前 === "string" &&
    "状態" in 値 &&
    typeof 値.状態 === "string" &&
    稼働状態値一覧.some((候補) => 候補 === 値.状態) &&
    "現在の作業" in 値 &&
    (値.現在の作業 === null || typeof 値.現在の作業 === "string") &&
    "札ID" in 値 &&
    (値.札ID === null || typeof 値.札ID === "number") &&
    "更新時刻" in 値 &&
    typeof 値.更新時刻 === "string"
  );
}
