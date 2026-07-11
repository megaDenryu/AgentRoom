import { 外殻レイアウト, アクティビティID } from "vscode-shell-layout";
import { ルームアイコン } from "../アイコン";
import { ルーム一覧サイドバー } from "../サイドバー/ルーム一覧サイドバー";
import { AgentRoomテーマ配色 } from "../テーマ";
import type { Relayクライアント } from "../通信/Relayクライアント";

const ルームアクティビティ = アクティビティID("ルーム");

// アプリシェルが集約する部品の型契約（部品DTO）。外殻レイアウトはコンストラクタで
// サイドバーを受け取るため、構築順ごとこのファクトリに閉じる。
// 会話UIが主役のためメニューバー・ステータスバーは非表示にし、AgentRoomに存在しない
// 設定画面のボタンも空配列指定で消す（構成とデザインの自由化、VscodeShellLayout README参照）
export class アプリシェル部品 {
  private constructor(
    readonly サイドバー: ルーム一覧サイドバー,
    readonly 外殻: 外殻レイアウト,
  ) {}

  static 作る(クライアント: Relayクライアント): アプリシェル部品 {
    const サイドバー = new ルーム一覧サイドバー(クライアント);
    const 外殻 = new 外殻レイアウト({
      タイトル: "AgentRoom",
      テーマ: AgentRoomテーマ配色,
      アクティビティ項目一覧: [
        { id: ルームアクティビティ, ラベル: "ルーム", アイコン: ルームアイコン },
      ],
      アクティビティバー下部項目一覧: [],
      メニューバー表示: false,
      ステータスバー表示: false,
      右サイドバー有効: true,
      パネル初期表示: false,
      右サイドバー内容: サイドバー,
    });
    return new アプリシェル部品(サイドバー, 外殻);
  }
}
