import { ルーム概要DTOか, 未読情報DTOか, type ルーム概要DTO, type 未読情報DTO } from "./メッセージ型";

export class RelayルームAPI {
  async 一覧(読者?: string): Promise<readonly ルーム概要DTO[]> {
    const query = 読者 === undefined ? "" : `?reader=${encodeURIComponent(読者)}`;
    const response = await fetch(`/api/rooms${query}`);
    if (!response.ok) throw new Error(`ルーム一覧の取得に失敗しました (HTTP ${response.status})`);
    const body: unknown = await response.json();
    if (!Array.isArray(body) || !body.every(ルーム概要DTOか)) throw new Error("ルーム一覧の応答が想定外の形式です");
    return body;
  }
  async 送信(args: { ルームID: string; 送信者: string; 本文: string; 宛先: string | null }): Promise<void> {
    const body: { 送信者: string; 本文: string; 宛先?: string } = { 送信者: args.送信者, 本文: args.本文 };
    if (args.宛先 !== null) body.宛先 = args.宛先;
    const response = await fetch(`/api/rooms/${encodeURIComponent(args.ルームID)}/messages`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`メッセージ送信に失敗しました (HTTP ${response.status})`);
  }
  async 未読(args: { ルームID: string; 読者: string }): Promise<未読情報DTO> {
    const response = await fetch(`/api/rooms/${encodeURIComponent(args.ルームID)}/unread?reader=${encodeURIComponent(args.読者)}`);
    if (!response.ok) throw new Error(`未読情報の取得に失敗しました (HTTP ${response.status})`);
    const body: unknown = await response.json();
    if (!未読情報DTOか(body)) throw new Error("未読情報の応答が想定外の形式です");
    return body;
  }
  async 既読(args: { ルームID: string; 読者: string; 連番: number }): Promise<void> {
    const response = await fetch(`/api/rooms/${encodeURIComponent(args.ルームID)}/read-position`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 読者: args.読者, 連番: args.連番 }),
    });
    if (!response.ok) throw new Error(`既読位置の送信に失敗しました (HTTP ${response.status})`);
  }
}
