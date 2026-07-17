import type { 配線ポート } from "sengen-ui";
import type { Iキャラシート内容配線 } from "./キャラシート内容";
import type { キャラシート部品 } from "./キャラシート部品";

export class キャラシートサービス {
  constructor(private readonly _部品: キャラシート部品, private readonly _配線: 配線ポート<Iキャラシート内容配線>) {}
  配線する(): void {
    this._部品.保存.onClick(() => {
      const input = this._部品.入力を取得する(); if (input !== null) this._配線.先.on保存(input);
    });
    this._部品.削除?.onClick(() => {
      if (this._部品.既存名 !== null) this._配線.先.on削除(this._部品.既存名);
    });
  }
}
