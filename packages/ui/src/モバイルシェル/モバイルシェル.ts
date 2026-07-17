import { div, LV2部品集約Base, type DivC } from "sengen-ui";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { キャラナビ項目id, 判定ナビ項目id, ルームナビ項目id, 札場ナビ項目id } from "./ナビ項目一覧";
import { モバイルシェルサービス } from "./モバイルシェルサービス";
import { モバイルシェル部品 } from "./モバイルシェル部品";
import * as styles from "./style.css";

// モバイル専用の最上位Orchestrator(LV2部品集約)。下部ナビ+単一フルスクリーンビュー+
// ボトムシートの3層構造を持つ。VscodeShellLayoutは使わず、SengenUIのLV2部品集約として
// 独立に組む(ARCHITECTURE.md「デスクトップとモバイルは別シェル・別ビュー」2026-07-14)
export class モバイルシェル extends LV2部品集約Base<モバイルシェル部品, モバイルシェルサービス> {
  protected _componentRoot: DivC;
  private readonly _部品: モバイルシェル部品;
  private readonly _サービス: モバイルシェルサービス;

  constructor(クライアント: Relayクライアント) {
    super();
    this._部品 = モバイルシェル部品.作る(クライアント);
    this._サービス = モバイルシェルサービス.作る(this._部品, クライアント);
    this._componentRoot = this._ルートを構築する(this._部品, this._サービス);
  }

  protected _ルートを構築する(
    部品: モバイルシェル部品,
    サービス: モバイルシェルサービス,
  ): DivC {
    部品.ルーム一覧ビュー.配線する({
      onルーム選択: (ルームID) => サービス.ルームを開く(ルームID),
    });
    部品.下部ナビ.配線する({
      on項目選択: (id) => {
        if (id === ルームナビ項目id) サービス.一覧へ戻る();
        else if (id === 札場ナビ項目id) サービス.札場を開く();
        else if (id === キャラナビ項目id) サービス.キャラを開く();
        else if (id === 判定ナビ項目id) サービス.判定を開く();
      },
    });
    return (
      div({ class: styles.ルート }).childs([
          div({ class: styles.画面レイヤー }).childs([
              部品.ルーム一覧ビュー,
              部品.会話スロット,
              部品.札場スロット,
              部品.判定スロット,
              部品.キャラ一覧ビュー]),
          部品.下部ナビ,
          部品.ボトムシート])
    );
  }
}
