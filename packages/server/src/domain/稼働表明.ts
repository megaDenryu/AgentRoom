import type { エージェント名 } from "./エージェント名.js";
import type { 参照札ID } from "./参照札ID.js";
import type { 現在の作業内容 } from "./現在の作業内容.js";
import { 稼働状態, type 稼働状態値 } from "./稼働状態.js";

// 最終更新からこの時間を超えたら、明示的な削除をせず応答時に「不明」として返す
// （参照: DESIGN.md 11章 Phase B、稼働表明はハートビート的に定期送信される前提）
export const 稼働表明TTLミリ秒 = 5 * 60 * 1000;

export type 表示稼働状態値 = 稼働状態値 | "不明";

// 誰か（人間もAIも同格）の稼働表明1件。ルームに属さずワークスペース直下の概念
// （参照: Jimbo/ARCHITECTURE.md「データ層とビュー層の分離」）
export class 稼働表明 {
  private constructor(
    readonly 名前: エージェント名,
    readonly 状態: 稼働状態,
    readonly 現在の作業: 現在の作業内容,
    readonly 参照札: 参照札ID | null,
    readonly 更新時刻ISO: string,
  ) {}

  static create(引数: {
    名前: エージェント名;
    状態: 稼働状態;
    現在の作業: 現在の作業内容;
    参照札: 参照札ID | null;
    更新時刻ISO: string;
  }): 稼働表明 {
    return new 稼働表明(
      引数.名前,
      引数.状態,
      引数.現在の作業,
      引数.参照札,
      引数.更新時刻ISO,
    );
  }

  // TTLを超えていれば申告値を無視して「不明」を返す。削除はせず応答時にだけ隠す
  // （GET /api/presence の仕様。参照: DESIGN.md 11章）
  表示状態を計算する(基準時刻ミリ秒: number): 表示稼働状態値 {
    const 更新時刻ミリ秒 = new Date(this.更新時刻ISO).getTime();
    if (基準時刻ミリ秒 - 更新時刻ミリ秒 > 稼働表明TTLミリ秒) {
      return "不明";
    }
    return this.状態.値;
  }

  toJSON(基準時刻ミリ秒: number): 稼働表明DTO {
    return {
      名前: this.名前.値,
      状態: this.表示状態を計算する(基準時刻ミリ秒),
      現在の作業: this.現在の作業.値,
      札ID: this.参照札?.値 ?? null,
      更新時刻: this.更新時刻ISO,
    };
  }
}

export interface 稼働表明DTO {
  readonly 名前: string;
  readonly 状態: 表示稼働状態値;
  readonly 現在の作業: string | null;
  readonly 札ID: number | null;
  readonly 更新時刻: string;
}
