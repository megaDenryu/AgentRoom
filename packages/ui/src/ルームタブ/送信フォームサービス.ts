import type { 配線ポート } from "sengen-ui";
import { 送信者名を保存する } from "../送信者名記憶";
import type { I送信フォーム配線, 送信内容 } from "./送信フォーム";
import type { 送信フォーム部品 } from "./送信フォーム部品";

export class 送信フォームサービス {
  constructor(private readonly _部品: 送信フォーム部品, private readonly _配線: 配線ポート<I送信フォーム配線>) {}
  配線する(): void {
    this._部品.送信者.onChange(() => 送信者名を保存する(this.送信者名()));
    this._部品.本文.addTextAreaEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); this.送信する(); }
    });
    this._部品.送信.onClick(() => this.送信する());
  }
  送信者名(): string { return this._部品.送信者.getValue().trim(); }
  送信する(): void {
    const data = this._入力を取得する(); if (data !== null) this._配線.先.on送信(data);
  }
  宛先候補を更新する(names: readonly string[]): void {
    const current = this._部品.宛先.getValue();
    this._部品.宛先.setOptions([{ value: "", text: this._部品.文言.全員宛ラベル },
      ...names.map((name) => ({ value: name, text: this._部品.文言.宛先ラベル(name) }))]);
    if (current !== "" && names.includes(current)) this._部品.宛先.setValue(current);
  }
  private _入力を取得する(): 送信内容 | null {
    const 送信者 = this.送信者名(); const 本文 = this._部品.本文.getValue().trim();
    if (本文.length === 0) return null;
    if (送信者.length === 0) { this._部品.エラー.表示する(this._部品.文言.送信者名必須エラー); return null; }
    const 宛先 = this._部品.宛先.getValue(); return { 送信者, 本文, 宛先: 宛先 === "" ? null : 宛先 };
  }
}
