import { ルーム概要DTOか, type ルーム概要DTO } from "./メッセージ型";

// Relay Server の REST API を叩くクライアント。
// URLは相対パスで書き、配信元ホスト（LAN内の別デバイスからのアクセスを含む）に自動追従させる
export class Relayクライアント {
  async ルーム一覧を取得する(): Promise<readonly ルーム概要DTO[]> {
    const 応答 = await fetch("/api/rooms");
    if (!応答.ok) {
      throw new Error(`ルーム一覧の取得に失敗しました (HTTP ${応答.status})`);
    }
    const 本体: unknown = await 応答.json();
    if (!Array.isArray(本体) || !本体.every(ルーム概要DTOか)) {
      throw new Error("ルーム一覧の応答が想定外の形式です");
    }
    return 本体;
  }

  async メッセージを送信する(引数: {
    ルームID: string;
    送信者: string;
    本文: string;
  }): Promise<void> {
    const 応答 = await fetch(
      `/api/rooms/${encodeURIComponent(引数.ルームID)}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 送信者: 引数.送信者, 本文: 引数.本文 }),
      },
    );
    if (!応答.ok) {
      throw new Error(`メッセージ送信に失敗しました (HTTP ${応答.status})`);
    }
  }
}
