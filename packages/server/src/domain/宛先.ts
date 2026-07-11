import { エージェント名 } from "./エージェント名.js";

// メッセージの宛先。「全員へのブロードキャスト」と「特定エージェント個別」を判別共用体で表す。
// JSON（DTO）上は null=全員 / string=個別 に写像する
export type 宛先 =
  | { readonly 種別: "全員" }
  | { readonly 種別: "個別"; readonly 名前: エージェント名 };

export const 全員宛: 宛先 = { 種別: "全員" };

export function 個別宛(名前: エージェント名): 宛先 {
  return { 種別: "個別", 名前 };
}

export function 宛先をDTO値にする(対象: 宛先): string | null {
  return 対象.種別 === "全員" ? null : 対象.名前.値;
}

export function 宛先をDTO値から作る(値: string | null): 宛先 {
  return 値 === null ? 全員宛 : 個別宛(エージェント名.create(値));
}
