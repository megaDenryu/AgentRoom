import { キャラDTOか, type キャラDTO } from "./キャラ型";
import {
  メンバーDTOか,
  ルーム概要DTOか,
  未読情報DTOか,
  稼働表明DTOか,
  type メンバーDTO,
  type ルーム概要DTO,
  type 未読情報DTO,
  type 稼働表明DTO,
} from "./メッセージ型";

// Relay Server の REST API を叩くクライアント。
// URLは相対パスで書き、配信元ホスト（LAN内の別デバイスからのアクセスを含む）に自動追従させる
export class Relayクライアント {
  async ルーム一覧を取得する(読者?: string): Promise<readonly ルーム概要DTO[]> {
    const クエリ = 読者 === undefined ? "" : `?reader=${encodeURIComponent(読者)}`;
    const 応答 = await fetch(`/api/rooms${クエリ}`);
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
    宛先: string | null;
  }): Promise<void> {
    const ボディ: { 送信者: string; 本文: string; 宛先?: string } = {
      送信者: 引数.送信者,
      本文: 引数.本文,
    };
    if (引数.宛先 !== null) {
      ボディ.宛先 = 引数.宛先;
    }
    const 応答 = await fetch(
      `/api/rooms/${encodeURIComponent(引数.ルームID)}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ボディ),
      },
    );
    if (!応答.ok) {
      throw new Error(`メッセージ送信に失敗しました (HTTP ${応答.status})`);
    }
  }

  async メンバー一覧を取得する(ルームID: string): Promise<readonly メンバーDTO[]> {
    const 応答 = await fetch(`/api/rooms/${encodeURIComponent(ルームID)}/members`);
    if (!応答.ok) {
      throw new Error(`メンバー一覧の取得に失敗しました (HTTP ${応答.status})`);
    }
    const 本体: unknown = await 応答.json();
    if (!Array.isArray(本体) || !本体.every(メンバーDTOか)) {
      throw new Error("メンバー一覧の応答が想定外の形式です");
    }
    return 本体;
  }

  async メンバーを登録する(引数: {
    ルームID: string;
    名前: string;
    種別: string;
  }): Promise<void> {
    const 応答 = await fetch(
      `/api/rooms/${encodeURIComponent(引数.ルームID)}/members/${encodeURIComponent(引数.名前)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 種別: 引数.種別 }),
      },
    );
    if (!応答.ok) {
      throw new Error(`メンバー登録に失敗しました (HTTP ${応答.status})`);
    }
  }

  async メンバーを削除する(引数: { ルームID: string; 名前: string }): Promise<void> {
    const 応答 = await fetch(
      `/api/rooms/${encodeURIComponent(引数.ルームID)}/members/${encodeURIComponent(引数.名前)}`,
      { method: "DELETE" },
    );
    if (!応答.ok) {
      throw new Error(`メンバー削除に失敗しました (HTTP ${応答.status})`);
    }
  }

  async 未読情報を取得する(引数: {
    ルームID: string;
    読者: string;
  }): Promise<未読情報DTO> {
    const 応答 = await fetch(
      `/api/rooms/${encodeURIComponent(引数.ルームID)}/unread?reader=${encodeURIComponent(引数.読者)}`,
    );
    if (!応答.ok) {
      throw new Error(`未読情報の取得に失敗しました (HTTP ${応答.status})`);
    }
    const 本体: unknown = await 応答.json();
    if (!未読情報DTOか(本体)) {
      throw new Error("未読情報の応答が想定外の形式です");
    }
    return 本体;
  }

  async 既読位置を送信する(引数: {
    ルームID: string;
    読者: string;
    連番: number;
  }): Promise<void> {
    const 応答 = await fetch(
      `/api/rooms/${encodeURIComponent(引数.ルームID)}/read-position`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 読者: 引数.読者, 連番: 引数.連番 }),
      },
    );
    if (!応答.ok) {
      throw new Error(`既読位置の送信に失敗しました (HTTP ${応答.status})`);
    }
  }

  // 稼働表明はルームに属さない（ワークスペース直下）ため、URLにルームIDを含まない。
  // 参照: DESIGN.md 11章 Phase B
  async 稼働一覧を取得する(): Promise<readonly 稼働表明DTO[]> {
    const 応答 = await fetch("/api/presence");
    if (!応答.ok) {
      throw new Error(`稼働状況の取得に失敗しました (HTTP ${応答.status})`);
    }
    const 本体: unknown = await 応答.json();
    if (!Array.isArray(本体) || !本体.every(稼働表明DTOか)) {
      throw new Error("稼働状況の応答が想定外の形式です");
    }
    return 本体;
  }

  // キャラ(人物)はルームに属さない(ワークスペース直下)ため、URLにルームIDを含まない
  async キャラ一覧を取得する(): Promise<readonly キャラDTO[]> {
    const 応答 = await fetch("/api/charas");
    if (!応答.ok) {
      throw new Error(`キャラ一覧の取得に失敗しました (HTTP ${応答.status})`);
    }
    const 本体: unknown = await 応答.json();
    if (!Array.isArray(本体) || !本体.every(キャラDTOか)) {
      throw new Error("キャラ一覧の応答が想定外の形式です");
    }
    return 本体;
  }

  // 既存名なら全項目上書きしてサーバー側で更新する(作成者・作成時刻は初回のまま不変。
  // packages/server/src/api/キャラルート.ts 参照)。新規名なら作成になる
  async キャラを登録する(引数: {
    名前: string;
    種別: string;
    作成者: string;
    プロンプト: string;
    アイコンdataUrl: string;
    行動パターンメモ: string;
  }): Promise<void> {
    const 応答 = await fetch(`/api/charas/${encodeURIComponent(引数.名前)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        種別: 引数.種別,
        作成者: 引数.作成者,
        プロンプト: 引数.プロンプト,
        アイコンdataUrl: 引数.アイコンdataUrl,
        行動パターンメモ: 引数.行動パターンメモ,
      }),
    });
    if (!応答.ok) {
      throw new Error(`キャラの登録に失敗しました (HTTP ${応答.status})`);
    }
  }

  async キャラを削除する(名前: string): Promise<void> {
    const 応答 = await fetch(`/api/charas/${encodeURIComponent(名前)}`, {
      method: "DELETE",
    });
    if (!応答.ok) {
      throw new Error(`キャラの削除に失敗しました (HTTP ${応答.status})`);
    }
  }
}
