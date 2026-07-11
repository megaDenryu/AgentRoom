// ルームはメッセージまたはメンバー登録から導出される概念で、明示的な作成操作を持たない
// （最初のメッセージ送信 or メンバー登録で暗黙に生まれる）。参照: DESIGN.md 4.1・10章
// 最終送信時刻はメッセージが1件も無いルームでは最新メンバーの参加時刻で代用する。
// 未読数は一覧取得時に読者が指定されなかった場合0になる
export interface ルーム概要 {
  readonly ルームID: string;
  readonly メッセージ数: number;
  readonly 最終連番: number;
  readonly 最終送信時刻: string;
  readonly 未読数: number;
}
