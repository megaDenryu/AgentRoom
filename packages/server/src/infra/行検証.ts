// better-sqlite3の戻り値はunknownなので、外部境界としてここで型ガードして絞る。
// スキーマは自分で定義しているため不一致はバグであり、例外で即座に露見させる

export function メッセージ行に絞る(行: unknown): {
  seq: number;
  room_id: string;
  sender: string;
  body: string;
  sent_at: string;
  to_agent: string | null;
} {
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "seq" in 行 &&
    typeof 行.seq === "number" &&
    "room_id" in 行 &&
    typeof 行.room_id === "string" &&
    "sender" in 行 &&
    typeof 行.sender === "string" &&
    "body" in 行 &&
    typeof 行.body === "string" &&
    "sent_at" in 行 &&
    typeof 行.sent_at === "string" &&
    "to_agent" in 行 &&
    (行.to_agent === null || typeof 行.to_agent === "string")
  ) {
    return {
      seq: 行.seq,
      room_id: 行.room_id,
      sender: 行.sender,
      body: 行.body,
      sent_at: 行.sent_at,
      to_agent: 行.to_agent,
    };
  }
  throw new Error(`messagesテーブルの行がスキーマと一致しません: ${JSON.stringify(行)}`);
}

export function ルーム概要行に絞る(行: unknown): {
  room_id: string;
  message_count: number;
  last_seq: number;
  last_sent_at: string;
} {
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "room_id" in 行 &&
    typeof 行.room_id === "string" &&
    "message_count" in 行 &&
    typeof 行.message_count === "number" &&
    "last_seq" in 行 &&
    typeof 行.last_seq === "number" &&
    "last_sent_at" in 行 &&
    typeof 行.last_sent_at === "string"
  ) {
    return {
      room_id: 行.room_id,
      message_count: 行.message_count,
      last_seq: 行.last_seq,
      last_sent_at: 行.last_sent_at,
    };
  }
  throw new Error(`ルーム概要クエリの行が想定と一致しません: ${JSON.stringify(行)}`);
}

export function メンバー行に絞る(行: unknown): {
  name: string;
  type: string;
  joined_at: string;
} {
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "name" in 行 &&
    typeof 行.name === "string" &&
    "type" in 行 &&
    typeof 行.type === "string" &&
    "joined_at" in 行 &&
    typeof 行.joined_at === "string"
  ) {
    return { name: 行.name, type: 行.type, joined_at: 行.joined_at };
  }
  throw new Error(`membersテーブルの行がスキーマと一致しません: ${JSON.stringify(行)}`);
}

export function 最終連番行に絞る(行: unknown): number {
  if (typeof 行 === "object" && 行 !== null && "last_seq" in 行) {
    if (行.last_seq === null) return 0;
    if (typeof 行.last_seq === "number") return 行.last_seq;
  }
  throw new Error(`最終連番クエリの行が想定と一致しません: ${JSON.stringify(行)}`);
}

export function 件数行に絞る(行: unknown): number {
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "count" in 行 &&
    typeof 行.count === "number"
  ) {
    return 行.count;
  }
  throw new Error(`件数クエリの行が想定と一致しません: ${JSON.stringify(行)}`);
}

export function 稼働表明行に絞る(行: unknown): {
  name: string;
  status: string;
  current_work: string | null;
  card_id: number | null;
  updated_at: string;
} {
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "name" in 行 &&
    typeof 行.name === "string" &&
    "status" in 行 &&
    typeof 行.status === "string" &&
    "current_work" in 行 &&
    (行.current_work === null || typeof 行.current_work === "string") &&
    "card_id" in 行 &&
    (行.card_id === null || typeof 行.card_id === "number") &&
    "updated_at" in 行 &&
    typeof 行.updated_at === "string"
  ) {
    return {
      name: 行.name,
      status: 行.status,
      current_work: 行.current_work,
      card_id: 行.card_id,
      updated_at: 行.updated_at,
    };
  }
  throw new Error(`presenceテーブルの行がスキーマと一致しません: ${JSON.stringify(行)}`);
}

export function 既読位置行に絞る(行: unknown): number {
  if (行 === undefined) return 0;
  if (
    typeof 行 === "object" &&
    行 !== null &&
    "last_read_seq" in 行 &&
    typeof 行.last_read_seq === "number"
  ) {
    return 行.last_read_seq;
  }
  throw new Error(`read_positionsテーブルの行がスキーマと一致しません: ${JSON.stringify(行)}`);
}
