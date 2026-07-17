import { カンバンビュー } from "FudabaUi/カンバン/カンバンビュー";
import { 札クライアント } from "FudabaUi/通信/札クライアント";
import { 問いクライアント } from "FudabaUi/通信/問いクライアント";
import { 問い判定キュー } from "FudabaUi/問い判定キュー/問い判定キュー";
import { キャラタブ } from "../キャラタブ/キャラタブ";
import type { Relayクライアント } from "../通信/Relayクライアント";
import { 判定アクティビティ } from "./アクティビティ一覧";
import type { アプリシェル部品 } from "./アプリシェル部品";

const 札場id = "札場"; const キャラid = "キャラ"; const 判定id = "人間判定";
export class 固定タブサービス {
  private readonly _判定: 問い判定キュー;
  constructor(private readonly _部品: アプリシェル部品, private readonly _client: Relayクライアント) {
    this._判定 = new 問い判定キュー(new 問いクライアント()).配線する({ on件数変更: (count) =>
      _部品.外殻.アクティビティバッジ件数を設定する(判定アクティビティ, count) });
  }
  札場を開く(): void {
    if (!this._部品.外殻.タブが存在するか(札場id)) {
      const view = new カンバンビュー(new 札クライアント());
      this._部品.外殻.タブを追加する(札場id, "札場", view);
      this._部品.外殻.タブ再読み込みボタンを追加する(札場id, () => view.更新する());
    }
    this._部品.外殻.タブを選択する(札場id);
  }
  キャラを開く(): void {
    if (!this._部品.外殻.タブが存在するか(キャラid))
      this._部品.外殻.タブを追加する(キャラid, "キャラ", new キャラタブ(this._client));
    this._部品.外殻.タブを選択する(キャラid);
  }
  判定を開く(): void {
    if (!this._部品.外殻.タブが存在するか(判定id)) {
      this._部品.外殻.タブを追加する(判定id, "人間判定", this._判定);
      this._部品.外殻.タブ再読み込みボタンを追加する(判定id, () => void this._判定.更新する());
    }
    this._部品.外殻.タブを選択する(判定id);
  }
}
