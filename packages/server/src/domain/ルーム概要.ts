// ルームはメッセージから導出される概念で、Phase 1では明示的な作成操作を持たない
// （最初のメッセージ送信で暗黙に生まれる）。参照: DESIGN.md 4.1
export interface ルーム概要 {
  readonly ルームID: string;
  readonly メッセージ数: number;
  readonly 最終連番: number;
  readonly 最終送信時刻: string;
}
