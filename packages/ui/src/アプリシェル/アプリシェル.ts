import { LV2部品集約Base } from "sengen-ui";
import type { 外殻レイアウト } from "vscode-shell-layout";
import type { 通知サービス } from "../通知サービス";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { アプリシェルサービス } from "./アプリシェルサービス";
import { アプリシェル部品 } from "./アプリシェル部品";

// アプリ全体のOrchestrator（LV2部品集約）。外殻レイアウトの各スロットへの注入と、
// サイドバー・シェルイベントの配線をここに集約する。タブ管理ロジックはサービス側にある
export class アプリシェル extends LV2部品集約Base<アプリシェル部品, アプリシェルサービス> {
  protected _componentRoot: 外殻レイアウト;
  private readonly _部品: アプリシェル部品;
  private readonly _サービス: アプリシェルサービス;

  constructor(クライアント: Relayクライアント, 通知: 通知サービス) {
    super();
    this._部品 = アプリシェル部品.作る(クライアント);
    this._サービス = アプリシェルサービス.作る({
      部品: this._部品,
      クライアント,
      通知,
    });
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
  }

  protected _ルートを構築する(
    部品: アプリシェル部品,
    サービス: アプリシェルサービス,
  ): 外殻レイアウト {
    部品.サイドバー.配線する({
      onルーム選択: (ルームID) => サービス.ルームタブを開く(ルームID),
      onメンバー選択: (名前) => サービス.相手フィルタを切り替える(名前),
      on通知有効化: () => void サービス.通知許可を要求する(),
    });
    部品.外殻.onタブイベント({
      onタブ選択: (タブid) => サービス.タブ選択を反映する(タブid),
      onタブ閉じる: (タブid) => サービス.タブを閉じる(タブid),
    });
    部品.外殻.onアクティビティ選択(() => {
      void 部品.サイドバー.更新する();
    });
    return 部品.外殻;
  }
}
