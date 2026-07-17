import type { 配線ポート } from "sengen-ui";
import type { Iキャラフォーム配線 } from "./キャラフォーム";
import type { キャラフォーム部品 } from "./キャラフォーム部品";

export class キャラフォームサービス {
  constructor(private readonly _部品: キャラフォーム部品, private readonly _配線: 配線ポート<Iキャラフォーム配線>) {}
  配線する(): void {
    this._部品.保存.onClick(() => {
      const input = this._部品.入力を取得する();
      if (input !== null) this._配線.先.on保存(input);
    });
    this._部品.キャンセル.onClick(() => { this._部品.クリアする(); this._配線.先.onキャンセル(); });
  }
}
