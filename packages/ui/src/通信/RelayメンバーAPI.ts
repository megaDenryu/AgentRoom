import { メンバーDTOか, type メンバーDTO } from "./メッセージ型";

export class RelayメンバーAPI {
  async 一覧(room: string): Promise<readonly メンバーDTO[]> {
    const response = await fetch(`/api/rooms/${encodeURIComponent(room)}/members`);
    if (!response.ok) throw new Error(`メンバー一覧の取得に失敗しました (HTTP ${response.status})`);
    const body: unknown = await response.json();
    if (!Array.isArray(body) || !body.every(メンバーDTOか)) throw new Error("メンバー一覧の応答が想定外の形式です");
    return body;
  }
  async 登録(args: { ルームID: string; 名前: string; 種別: string }): Promise<void> {
    const response = await fetch(`/api/rooms/${encodeURIComponent(args.ルームID)}/members/${encodeURIComponent(args.名前)}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ 種別: args.種別 }),
    });
    if (!response.ok) throw new Error(`メンバー登録に失敗しました (HTTP ${response.status})`);
  }
  async 削除(args: { ルームID: string; 名前: string }): Promise<void> {
    const response = await fetch(`/api/rooms/${encodeURIComponent(args.ルームID)}/members/${encodeURIComponent(args.名前)}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`メンバー削除に失敗しました (HTTP ${response.status})`);
  }
}
