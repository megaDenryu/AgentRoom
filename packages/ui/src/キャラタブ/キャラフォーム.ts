import { div, span, LV2部品集約Base, 配線ポート, type DivC, type I配線可能 } from "sengen-ui";
import type { キャラDTO } from "../通信/キャラ型";
import { キャラフォーム部品 } from "./キャラフォーム部品";
import { キャラフォームサービス } from "./キャラフォームサービス";
import type { キャラタブ内容 } from "./キャラタブ内容";
import * as styles from "./style.css";

export interface キャラ入力 {
  readonly 名前: string; readonly 種別: string; readonly プロンプト: string;
  readonly アイコンdataUrl: string; readonly 行動パターンメモ: string;
}
export interface Iキャラフォーム配線 { on保存(入力: キャラ入力): void; onキャンセル(): void }

export class キャラフォーム extends LV2部品集約Base<キャラフォーム部品, キャラフォームサービス>
  implements I配線可能<Iキャラフォーム配線> {
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iキャラフォーム配線>("キャラフォーム");
  private readonly _部品: キャラフォーム部品;
  private readonly _サービス: キャラフォームサービス;
  constructor(private readonly _文言: キャラタブ内容) {
    super(); this._部品 = new キャラフォーム部品(_文言);
    this._サービス = new キャラフォームサービス(this._部品, this._配線);
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
  }
  protected _ルートを構築する(部品: キャラフォーム部品, service: キャラフォームサービス): DivC {
    service.配線する();
    return div({ class: styles.フォーム側 }).childs([
      span({ text: this._文言.フォーム見出し, class: styles.見出し }),
      部品.名前, 部品.種別, 部品.アイコン, 部品.プロンプト, 部品.行動, 部品.保存, 部品.キャンセル,
    ]);
  }
  配線する(配線: Iキャラフォーム配線): this { this._配線.配線する(配線); return this; }
  編集内容を設定する(chara: キャラDTO): void { this._部品.編集を設定する(chara); }
  クリアする(): void { this._部品.クリアする(); }
}
