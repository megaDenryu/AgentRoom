import { div, LV2部品集約Base, 配線ポート, type DivC, type I配線可能 } from "sengen-ui";
import type { ルームタブ内容 } from "./ルームタブ内容";
import { 送信フォームサービス } from "./送信フォームサービス";
import { 送信フォーム部品 } from "./送信フォーム部品";
import * as styles from "./style.css";

export interface 送信内容 { readonly 送信者: string; readonly 本文: string; readonly 宛先: string | null }
export interface I送信フォーム配線 { on送信(内容: 送信内容): void }

export class 送信フォーム extends LV2部品集約Base<送信フォーム部品, 送信フォームサービス>
  implements I配線可能<I送信フォーム配線> {
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I送信フォーム配線>("送信フォーム");
  private readonly _部品: 送信フォーム部品;
  private readonly _サービス: 送信フォームサービス;
  constructor(文言: ルームタブ内容) {
    super(); this._部品 = new 送信フォーム部品(文言);
    this._サービス = new 送信フォームサービス(this._部品, this._配線);
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
  }
  protected _ルートを構築する(部品: 送信フォーム部品, service: 送信フォームサービス): DivC {
    service.配線する();
    return div({ class: styles.入力欄 }).childs([部品.送信者, 部品.宛先, 部品.本文, 部品.送信, 部品.エラー]);
  }
  配線する(配線: I送信フォーム配線): this { this._配線.配線する(配線); return this; }
  送信者名(): string { return this._サービス.送信者名(); }
  宛先候補を更新する(names: readonly string[]): void { this._サービス.宛先候補を更新する(names); }
  送信中にする(value: boolean): void { this._部品.送信.setDisabled(value); }
  本文をクリアする(): void { this._部品.本文.setValue(""); this._部品.エラー.クリアする(); }
  エラーを表示する(text: string): void { this._部品.エラー.表示する(text); }
}
