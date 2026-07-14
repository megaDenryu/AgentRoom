// ルームIDはサーバー側(packages/server の ルームID.create())と同じ基準で検証する:
// 制御文字禁止・前後空白禁止・1〜64文字(コードポイント)・"/""\"禁止(URLパス区切りの実務上のみ)。
// 日本語を含む任意のUnicode文字列を許容する。ここでは送信前に同じ判定を行い、
// サーバーへ送ってから素の HTTP 400 が返る前にわかりやすい日本語エラーへ差し替える。
function 制御文字を含むか(値: string): boolean {
  for (let 位置 = 0; 位置 < 値.length; 位置 += 1) {
    const コード = 値.charCodeAt(位置);
    if (コード <= 0x1f || コード === 0x7f) {
      return true;
    }
  }
  return false;
}

export function ルームIDが妥当か(値: string): boolean {
  const 文字数 = [...値].length;
  if (文字数 < 1 || 文字数 > 64) return false;
  if (値 !== 値.trim()) return false;
  if (制御文字を含むか(値)) return false;
  if (値.includes("/") || 値.includes("\\")) return false;
  return true;
}

export const ルームID不正時のメッセージ =
  "ルーム名は1〜64文字で入力してください（制御文字・前後の空白・\"/\"\"\\\"は使えません）";
