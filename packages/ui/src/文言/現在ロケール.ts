import { 既定ロケール, ロケール値か, type ロケール } from "./ロケール";

// UI表示言語はサーバー側の状態に載せず、renderer側のlocalStorageのみに保持する。
// 表示言語はrenderer描画にしか影響しない純粋なUI関心事であり、REST/WS経由の
// 永続化配線を増やすコストに見合わない(Jimbo文言基盤README「AppConfigに載せない理由」と同じ判断)。
// 切替の反映は再読み込みで行う設計のため、動的な変更通知(購読)の仕組みも持たない。
const ローカルストレージキー = "agentroom.ui.locale";

export function 現在ロケールを取得する(): ロケール {
  const 保存値 = window.localStorage.getItem(ローカルストレージキー);
  return 保存値 !== null && ロケール値か(保存値) ? 保存値 : 既定ロケール;
}

export function ロケールを保存する(ロケール: ロケール): void {
  window.localStorage.setItem(ローカルストレージキー, ロケール);
}
