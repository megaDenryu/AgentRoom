// 人間の発言入力欄の送信者名をブラウザに記憶する。
// localStorageが使えない環境（プライベートモード等）でも入力自体は成立させる

const 保存キー = "agentroom.送信者名";
const デフォルト送信者名 = "人間";

export function 送信者名を読み込む(): string {
  try {
    const 保存値 = window.localStorage.getItem(保存キー);
    if (保存値 !== null && 保存値.trim().length > 0) {
      return 保存値;
    }
  } catch {
    // localStorage不可の環境ではデフォルトへフォールバックする
  }
  return デフォルト送信者名;
}

export function 送信者名を保存する(送信者名: string): void {
  try {
    window.localStorage.setItem(保存キー, 送信者名);
  } catch {
    // 保存できなくても入力欄の値はそのまま使えるため無視する
  }
}
