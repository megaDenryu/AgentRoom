import { メッセージDTOか, type メッセージDTO } from "./メッセージ型";

// WSの接続状態。切断は「再接続待ちミリ秒」を値として運び、UI側がバナー表示に使う
export type 接続状態 =
  | { readonly 種別: "接続試行中" }
  | { readonly 種別: "接続済み" }
  | { readonly 種別: "再接続待ち"; readonly 待機ミリ秒: number };

const 再接続初期待機ミリ秒 = 1_000;
const 再接続最大待機ミリ秒 = 30_000;

function JSONとして読む(生データ: string): unknown {
  try {
    return JSON.parse(生データ);
  } catch {
    return undefined;
  }
}

// 1ルーム分のWebSocket接続。切断時は指数バックオフで自動再接続し、
// 再接続時は受信済みの最終連番を ?after= に渡して取りこぼしと重複を防ぐ
export class ルーム接続 {
  private ソケット: WebSocket | null = null;
  private 再接続タイマーID: number | null = null;
  private 再接続失敗回数 = 0;
  private 受信済み最終連番 = 0;
  private 破棄済み = false;

  constructor(
    private readonly ルームID: string,
    private readonly 購読者: {
      on新着: (メッセージ: メッセージDTO) => void;
      on状態変化: (状態: 接続状態) => void;
    },
  ) {}

  開始する(): void {
    this.接続する();
  }

  破棄する(): void {
    this.破棄済み = true;
    if (this.再接続タイマーID !== null) {
      window.clearTimeout(this.再接続タイマーID);
      this.再接続タイマーID = null;
    }
    this.ソケット?.close();
    this.ソケット = null;
  }

  private 接続する(): void {
    if (this.破棄済み) return;
    this.購読者.on状態変化({ 種別: "接続試行中" });

    // LAN内の別デバイスからも使うため、接続先はページの location.host から導出する
    const プロトコル = location.protocol === "https:" ? "wss" : "ws";
    const url = `${プロトコル}://${location.host}/ws/rooms/${encodeURIComponent(this.ルームID)}?after=${this.受信済み最終連番}`;
    const ソケット = new WebSocket(url);
    this.ソケット = ソケット;

    ソケット.addEventListener("open", () => {
      this.再接続失敗回数 = 0;
      this.購読者.on状態変化({ 種別: "接続済み" });
    });

    ソケット.addEventListener("message", (イベント) => {
      const 生データ: unknown = イベント.data;
      if (typeof 生データ !== "string") return;
      const 解析結果 = JSONとして読む(生データ);
      if (!メッセージDTOか(解析結果)) return;
      if (解析結果.連番 > this.受信済み最終連番) {
        this.受信済み最終連番 = 解析結果.連番;
      }
      this.購読者.on新着(解析結果);
    });

    // errorイベントの後には必ずcloseが来るため、再接続の起点はcloseに一本化する
    ソケット.addEventListener("close", () => {
      if (this.破棄済み) return;
      this.再接続を予約する();
    });
  }

  private 再接続を予約する(): void {
    const 待機ミリ秒 = Math.min(
      再接続初期待機ミリ秒 * 2 ** this.再接続失敗回数,
      再接続最大待機ミリ秒,
    );
    this.再接続失敗回数 += 1;
    this.購読者.on状態変化({ 種別: "再接続待ち", 待機ミリ秒 });
    this.再接続タイマーID = window.setTimeout(() => {
      this.再接続タイマーID = null;
      this.接続する();
    }, 待機ミリ秒);
  }
}
