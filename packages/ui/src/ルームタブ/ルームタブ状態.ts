import type { メッセージDTO } from "../通信/メッセージ型";

// ルームタブの表示状態DTO。ロジック（通信・タイマー）はルームタブサービス側にある
export class ルームタブ状態 {
  readonly 全メッセージ: メッセージDTO[] = [];
  // 送信者名 → エージェント種別（HUMANバッジと宛先候補の元データ）
  readonly メンバー種別 = new Map<string, string>();
  フィルタ相手: string | null = null;
  // タブを開いた時点の既読位置（「ここから未読」区切り線の基準）。null=未取得で区切りを描かない。
  // 既読送信で位置が進んでも、開いている間は区切り線を動かさない
  未読区切り基準: number | null = null;
  送信済み既読位置 = 0;
  区切り表示済み = false;

  受信済み最終連番(): number {
    const 最後 = this.全メッセージ[this.全メッセージ.length - 1];
    return 最後?.連番 ?? 0;
  }

  表示対象か(メッセージ: メッセージDTO): boolean {
    if (this.フィルタ相手 === null) return true;
    return (
      メッセージ.送信者 === this.フィルタ相手 || メッセージ.宛先 === this.フィルタ相手
    );
  }

  未読区切り対象か(メッセージ: メッセージDTO, 自分: string): boolean {
    return (
      this.未読区切り基準 !== null &&
      メッセージ.連番 > this.未読区切り基準 &&
      メッセージ.送信者 !== 自分
    );
  }
}
