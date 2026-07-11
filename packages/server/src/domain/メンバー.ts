import type { エージェント名 } from "./エージェント名.js";
import type { エージェント種別 } from "./エージェント種別.js";

// ルームのメンバー台帳の1行。ルームIDは持たせない
// （台帳の取得・更新は常にルーム単位で行われ、行単体がルームを跨いで運ばれることがない）
export class メンバー {
  private constructor(
    readonly 名前: エージェント名,
    readonly 種別: エージェント種別,
    readonly 参加時刻ISO: string,
  ) {}

  static create(引数: {
    名前: エージェント名;
    種別: エージェント種別;
    参加時刻ISO: string;
  }): メンバー {
    return new メンバー(引数.名前, 引数.種別, 引数.参加時刻ISO);
  }

  toJSON(): メンバーDTO {
    return {
      名前: this.名前.値,
      種別: this.種別.値,
      参加時刻: this.参加時刻ISO,
    };
  }
}

export interface メンバーDTO {
  readonly 名前: string;
  readonly 種別: string;
  readonly 参加時刻: string;
}
