import { 検証エラー } from "./検証エラー.js";

// Fudaba（札場）の札IDへの緩い参照。AgentRoomはFudabaのスキーマを知らず、
// DB跨ぎの外部キーも張らない（参照: Jimbo/ARCHITECTURE.md「住民の実装形態」）。
// 存在確認はせず、正の整数であることだけを検証する
export class 参照札ID {
  private constructor(private readonly 内部値: number) {}

  static create(値: number | null | undefined): 参照札ID | null {
    if (値 === null || 値 === undefined) {
      return null;
    }
    if (!Number.isInteger(値) || 値 <= 0) {
      throw new 検証エラー(`札IDは正の整数である必要があります: ${値}`);
    }
    return new 参照札ID(値);
  }

  get 値(): number {
    return this.内部値;
  }
}
