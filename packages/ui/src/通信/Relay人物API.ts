import { キャラDTOか, type キャラDTO } from "./キャラ型";
import { 稼働表明DTOか, type 稼働表明DTO } from "./メッセージ型";

export interface キャラ登録入力 {
  名前: string; 種別: string; 作成者: string; プロンプト: string;
  アイコンdataUrl: string; 行動パターンメモ: string;
}
export class Relay人物API {
  async 稼働一覧(): Promise<readonly 稼働表明DTO[]> {
    const response = await fetch("/api/presence");
    if (!response.ok) throw new Error(`稼働状況の取得に失敗しました (HTTP ${response.status})`);
    const body: unknown = await response.json();
    if (!Array.isArray(body) || !body.every(稼働表明DTOか)) throw new Error("稼働状況の応答が想定外の形式です");
    return body;
  }
  async キャラ一覧(): Promise<readonly キャラDTO[]> {
    const response = await fetch("/api/charas");
    if (!response.ok) throw new Error(`キャラ一覧の取得に失敗しました (HTTP ${response.status})`);
    const body: unknown = await response.json();
    if (!Array.isArray(body) || !body.every(キャラDTOか)) throw new Error("キャラ一覧の応答が想定外の形式です");
    return body;
  }
  async キャラ登録(args: キャラ登録入力): Promise<void> {
    const response = await fetch(`/api/charas/${encodeURIComponent(args.名前)}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        種別: args.種別, 作成者: args.作成者, プロンプト: args.プロンプト,
        アイコンdataUrl: args.アイコンdataUrl, 行動パターンメモ: args.行動パターンメモ,
      }),
    });
    if (!response.ok) throw new Error(`キャラの登録に失敗しました (HTTP ${response.status})`);
  }
  async キャラ削除(name: string): Promise<void> {
    const response = await fetch(`/api/charas/${encodeURIComponent(name)}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`キャラの削除に失敗しました (HTTP ${response.status})`);
  }
}
