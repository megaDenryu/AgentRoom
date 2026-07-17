import { div, span, LV2部品集約Base, 配線ポート, type DivC, type I配線可能 } from "sengen-ui";
import type { キャラDTO } from "../../通信/キャラ型";
import type { キャラ一覧内容 } from "./キャラ一覧内容";
import { キャラシート部品 } from "./キャラシート部品";
import { キャラシートサービス } from "./キャラシートサービス";
import * as styles from "./style.css";

export interface キャラ入力 { readonly 名前: string; readonly 種別: string; readonly プロンプト: string;
  readonly アイコンdataUrl: string; readonly 行動パターンメモ: string }
export interface Iキャラシート内容配線 { on保存(入力: キャラ入力): void; on削除(名前: string): void }

export class キャラシート内容 extends LV2部品集約Base<キャラシート部品, キャラシートサービス>
  implements I配線可能<Iキャラシート内容配線> {
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<Iキャラシート内容配線>("キャラシート内容");
  private readonly _部品: キャラシート部品;
  private readonly _サービス: キャラシートサービス;
  constructor(文言: キャラ一覧内容, existing?: キャラDTO) {
    super(); this._部品 = new キャラシート部品(文言, existing);
    this._サービス = new キャラシートサービス(this._部品, this._配線);
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
  }
  protected _ルートを構築する(部品: キャラシート部品, service: キャラシートサービス): DivC {
    service.配線する();
    return div({ class: styles.シート本体 }).childs([
      span({ text: 部品.既存名 === null ? 部品.文言.シート見出し作成 : 部品.文言.シート見出し編集,
        class: styles.シート見出し }),
      部品.名前, 部品.種別, 部品.アイコン, 部品.プロンプト, 部品.行動, 部品.エラー,
      div({ class: styles.ボタン行 }).childs([部品.保存, ...(部品.削除 === null ? [] : [部品.削除])]),
    ]);
  }
  配線する(配線: Iキャラシート内容配線): this { this._配線.配線する(配線); return this; }
  エラーを表示する(text: string): void { this._部品.エラー.表示する(text); }
  保存中にする(value: boolean): void { this._部品.保存.setDisabled(value); }
}
