import type { 文書概要 } from "./文書概要.js";
import type { 文書パス } from "./文書パス.js";
import type { 文書リポジトリ名 } from "./文書リポジトリ名.js";
import type { 文書タイトル } from "./文書タイトル.js";

// 仕様書・成果物のmd文書1件についての索引エントリ。文書本文は持たず、gitで管理された
// 実体ファイルへの弱参照(リポジトリ名+相対パス)だけを保持する。参照:
// Jimbo/ARCHITECTURE.md「Phase C設計」推奨案(案2: git正、ワークスペースは索引のみ)
export class 文書索引エントリ {
  private constructor(
    readonly ID: number,
    readonly リポジトリ: 文書リポジトリ名,
    readonly パス: 文書パス,
    readonly タイトル: 文書タイトル,
    readonly 概要: 文書概要,
    readonly 登録時刻ISO: string,
    readonly 最終索引時刻ISO: string,
  ) {}

  static create(引数: {
    ID: number;
    リポジトリ: 文書リポジトリ名;
    パス: 文書パス;
    タイトル: 文書タイトル;
    概要: 文書概要;
    登録時刻ISO: string;
    最終索引時刻ISO: string;
  }): 文書索引エントリ {
    return new 文書索引エントリ(
      引数.ID,
      引数.リポジトリ,
      引数.パス,
      引数.タイトル,
      引数.概要,
      引数.登録時刻ISO,
      引数.最終索引時刻ISO,
    );
  }

  toJSON(): 文書索引エントリDTO {
    return {
      ID: this.ID,
      リポジトリ: this.リポジトリ.値,
      パス: this.パス.値,
      タイトル: this.タイトル.値,
      概要: this.概要.値,
      登録時刻: this.登録時刻ISO,
      最終索引時刻: this.最終索引時刻ISO,
    };
  }
}

export interface 文書索引エントリDTO {
  readonly ID: number;
  readonly リポジトリ: string;
  readonly パス: string;
  readonly タイトル: string;
  readonly 概要: string | null;
  readonly 登録時刻: string;
  readonly 最終索引時刻: string;
}
