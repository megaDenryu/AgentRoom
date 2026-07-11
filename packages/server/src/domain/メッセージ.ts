import { エージェント名 } from "./エージェント名.js";
import { ルームID } from "./ルームID.js";
import { type 宛先, 宛先をDTO値にする } from "./宛先.js";

// 連番はルーム内ではなくサーバー全体で単調増加する（SQLiteのAUTOINCREMENT由来）。
// クライアントは「このルームで連番Nより後」という形で新着を問い合わせる
export class メッセージ {
  private constructor(
    readonly 連番: number,
    readonly ルーム: ルームID,
    readonly 送信者: エージェント名,
    readonly 本文: string,
    readonly 送信時刻ISO: string,
    readonly 宛先: 宛先,
  ) {}

  static create(引数: {
    連番: number;
    ルーム: ルームID;
    送信者: エージェント名;
    本文: string;
    送信時刻ISO: string;
    宛先: 宛先;
  }): メッセージ {
    if (!Number.isInteger(引数.連番) || 引数.連番 <= 0) {
      throw new Error(`連番は正の整数である必要があります: ${引数.連番}`);
    }
    if (引数.本文.length === 0) {
      throw new Error("本文が空のメッセージは作れません");
    }
    return new メッセージ(
      引数.連番,
      引数.ルーム,
      引数.送信者,
      引数.本文,
      引数.送信時刻ISO,
      引数.宛先,
    );
  }

  toJSON(): メッセージDTO {
    return {
      連番: this.連番,
      ルームID: this.ルーム.値,
      送信者: this.送信者.値,
      本文: this.本文,
      送信時刻: this.送信時刻ISO,
      宛先: 宛先をDTO値にする(this.宛先),
    };
  }
}

export interface メッセージDTO {
  readonly 連番: number;
  readonly ルームID: string;
  readonly 送信者: string;
  readonly 本文: string;
  readonly 送信時刻: string;
  readonly 宛先: string | null;
}
