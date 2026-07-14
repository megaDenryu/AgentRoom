import { 狭幅ブレークポイントpx } from "./レスポンシブ";

// モバイルシェル/デスクトップシェルのどちらを初期表示するかを決める。
// 通常は画面幅で自動判定するが、ユーザーが手動切替リンクを押した場合はその選択を
// localStorageに記憶し、次回以降も画面幅に関わらず同じシェルを優先する
export type 表示モード = "mobile" | "desktop";

const 保存キー = "agentroom.表示モード上書き";

function 表示モード上書きを読み込む(): 表示モード | null {
  try {
    const 値 = window.localStorage.getItem(保存キー);
    return 値 === "mobile" || 値 === "desktop" ? 値 : null;
  } catch {
    return null;
  }
}

// 手動切替リンクから呼ぶ。選択を保存してからページを再読み込みし、
// main.tsの初期分岐に選択結果を反映させる
export function 表示モードを切り替える(モード: 表示モード): void {
  try {
    window.localStorage.setItem(保存キー, モード);
  } catch {
    // 保存できなくても切替操作自体は継続する(次回起動時は幅判定に戻るだけ)
  }
  window.location.reload();
}

export function 初期表示モードを判定する(): 表示モード {
  const 上書き = 表示モード上書きを読み込む();
  if (上書き !== null) return 上書き;
  return window.innerWidth < 狭幅ブレークポイントpx ? "mobile" : "desktop";
}
