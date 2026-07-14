// ISO時刻文字列を「n秒前 / n分前 / n時間前 / 日付」の相対表現に変換する。
// サイドバーの稼働状況・メンバー等、複数箇所から使える小さな純関数として独立させる
export function 相対時刻を表示する(iso文字列: string, 基準時刻ミリ秒: number = Date.now()): string {
  const 対象時刻 = new Date(iso文字列);
  if (Number.isNaN(対象時刻.getTime())) return iso文字列;

  const 経過秒 = Math.floor((基準時刻ミリ秒 - 対象時刻.getTime()) / 1000);
  if (経過秒 < 0) return "たった今";
  if (経過秒 < 60) return "たった今";
  if (経過秒 < 3600) return `${Math.floor(経過秒 / 60)}分前`;
  if (経過秒 < 86400) return `${Math.floor(経過秒 / 3600)}時間前`;

  return 対象時刻.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
