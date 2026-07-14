import {
  button,
  div,
  span,
  textInput,
  LV2HtmlComponentBase,
  配線ポート,
  type ButtonC,
  type DivC,
  type I配線可能,
  type TextInputC,
} from "sengen-ui";
import { ルームIDが妥当か, ルームID不正時のメッセージを返す } from "../../サイドバー/ルームID検証";
import { 現在ロケールを取得する } from "../../文言/現在ロケール";
import { エラー表示ラベル } from "../エラー表示ラベル";
import type { ルーム一覧内容 } from "./ルーム一覧内容";
import * as styles from "./style.css";

export interface I新規ルームシート内容配線 {
  on作成(ルームID: string): void;
}

// ボトムシートに差し込む「新しいルームを作成」の入力内容(モバイル専用のLV2素部品)。
// ルームIDの文字種チェックはデスクトップの新規ルームフォームと同じ規律(サイドバー/ルームID検証.ts)
// をそのまま使い、不正な文字が混じっている場合はこの時点で日本語エラーを表示して止める
// (ネットワークを呼ばない)。フォーマットが正しい場合だけon作成を発火し、実際のメンバー登録
// (ネットワーク呼び出し)は配線先のルーム一覧ビューサービスに任せる
export class 新規ルームシート内容
  extends LV2HtmlComponentBase
  implements I配線可能<I新規ルームシート内容配線>
{
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I新規ルームシート内容配線>("新規ルームシート内容");
  private readonly _入力: TextInputC;
  private readonly _エラー表示 = new エラー表示ラベル();
  private readonly _作成ボタン: ButtonC;

  constructor(private readonly _文言: ルーム一覧内容) {
    super();
    this._入力 = textInput({
      placeholder: _文言.新規ルーム名プレースホルダ,
      class: styles.新規ルーム入力,
    }).onEnterKey(() => this._作成を試みる());
    this._作成ボタン = button({
      text: _文言.新規ルーム作成ボタン,
      class: styles.新規ルーム作成ボタン,
    }).onClick(() => this._作成を試みる());
    this._componentRoot = this._ルートを構築する(this._入力, this._エラー表示, this._作成ボタン);
  }

  配線する(配線: I新規ルームシート内容配線): this {
    this._配線.配線する(配線);
    return this;
  }

  エラーを表示する(文言: string): void {
    this._エラー表示.表示する(文言);
  }

  作成中にする(作成中: boolean): void {
    this._作成ボタン.setDisabled(作成中);
  }

  private _ルートを構築する(入力: TextInputC, エラー表示: エラー表示ラベル, 作成ボタン: ButtonC): DivC {
    return (
      div({ class: styles.新規ルームシート }).childs([
          span({ text: this._文言.新規ルーム見出し, class: styles.新規ルーム見出し }),
          入力,
          エラー表示,
          作成ボタン])
    );
  }

  private _作成を試みる(): void {
    const ルームID = this._入力.getValue().trim();
    if (ルームID.length === 0) return;
    if (!ルームIDが妥当か(ルームID)) {
      this._エラー表示.表示する(ルームID不正時のメッセージを返す(現在ロケールを取得する()));
      return;
    }
    this._エラー表示.クリアする();
    this._配線.先.on作成(ルームID);
  }
}
