import type { アイコンDataUrl } from "./アイコンDataUrl.js";
import type { エージェント名 } from "./エージェント名.js";
import type { キャラ種別 } from "./キャラ種別.js";
import type { キャラプロンプト } from "./キャラプロンプト.js";
import type { 行動パターンメモ } from "./行動パターンメモ.js";

// ワークスペース直下の第一級エンティティ「キャラ(人物)」。ルームに属さず、
// 札の担当者・ルームメンバー・presence名からは名前文字列による緩い参照を受ける
// （参照: 札#35「方針修正」。既存のAgentsデータ(id/name/prompt/iconDataUrl)を包含し、
// Jimbo側のAgentsタブはこのエンティティのビューへ改修される想定）
export class キャラ {
  private constructor(
    readonly 名前: エージェント名,
    readonly 種別: キャラ種別,
    readonly プロンプト: キャラプロンプト,
    readonly アイコン: アイコンDataUrl,
    readonly 行動パターンメモ: 行動パターンメモ,
    readonly 作成者: エージェント名,
    readonly 作成時刻ISO: string,
    readonly 更新時刻ISO: string,
  ) {}

  static create(引数: {
    名前: エージェント名;
    種別: キャラ種別;
    プロンプト: キャラプロンプト;
    アイコン: アイコンDataUrl;
    行動パターンメモ: 行動パターンメモ;
    作成者: エージェント名;
    作成時刻ISO: string;
    更新時刻ISO: string;
  }): キャラ {
    return new キャラ(
      引数.名前,
      引数.種別,
      引数.プロンプト,
      引数.アイコン,
      引数.行動パターンメモ,
      引数.作成者,
      引数.作成時刻ISO,
      引数.更新時刻ISO,
    );
  }

  toJSON(): キャラDTO {
    return {
      名前: this.名前.値,
      種別: this.種別.値,
      プロンプト: this.プロンプト.値,
      アイコンdataUrl: this.アイコン.値,
      行動パターンメモ: this.行動パターンメモ.値,
      作成者: this.作成者.値,
      作成時刻: this.作成時刻ISO,
      更新時刻: this.更新時刻ISO,
    };
  }
}

export interface キャラDTO {
  readonly 名前: string;
  readonly 種別: string;
  readonly プロンプト: string;
  readonly アイコンdataUrl: string;
  readonly 行動パターンメモ: string;
  readonly 作成者: string;
  readonly 作成時刻: string;
  readonly 更新時刻: string;
}
