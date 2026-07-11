import { ページが非表示か } from "./ページ可視性";

// デスクトップ通知と効果音。ページ非表示中（document.hidden）の新着だけを知らせる。
// Notification APIが無い環境（非HTTPSのLANアクセス等）でも効果音は鳴らせるよう分離している
export type 通知許可状態 = "granted" | "denied" | "default" | "unsupported";

function Notificationが使えるか(): boolean {
  return typeof Notification !== "undefined";
}

export class 通知サービス {
  // 前提: AudioContextはユーザー操作起点で生成しないとブラウザにsuspendされる。
  // 「通知を有効化」ボタンのクリック（許可を要求する）で生成する
  private _音声コンテキスト: AudioContext | null = null;

  現在の許可状態(): 通知許可状態 {
    if (!Notificationが使えるか()) return "unsupported";
    return Notification.permission;
  }

  async 許可を要求する(): Promise<通知許可状態> {
    this._音声コンテキストを確保する();
    if (!Notificationが使えるか()) return "unsupported";
    return Notification.requestPermission();
  }

  新着を知らせる(引数: { 送信者: string; 本文: string; ルームID: string }): void {
    if (!ページが非表示か()) return;
    this._効果音を鳴らす();
    if (Notificationが使えるか() && Notification.permission === "granted") {
      new Notification(`${引数.送信者} (${引数.ルームID})`, {
        body: 引数.本文.slice(0, 120),
        tag: `agentroom-${引数.ルームID}`,
      });
    }
  }

  private _音声コンテキストを確保する(): AudioContext | null {
    if (this._音声コンテキスト === null && typeof AudioContext !== "undefined") {
      this._音声コンテキスト = new AudioContext();
    }
    if (this._音声コンテキスト?.state === "suspended") {
      void this._音声コンテキスト.resume();
    }
    return this._音声コンテキスト;
  }

  private _効果音を鳴らす(): void {
    const コンテキスト = this._音声コンテキストを確保する();
    if (コンテキスト === null || コンテキスト.state !== "running") return;
    const 発振器 = コンテキスト.createOscillator();
    const 音量 = コンテキスト.createGain();
    発振器.type = "sine";
    発振器.frequency.value = 880;
    音量.gain.setValueAtTime(0.08, コンテキスト.currentTime);
    音量.gain.exponentialRampToValueAtTime(0.0001, コンテキスト.currentTime + 0.25);
    発振器.connect(音量);
    音量.connect(コンテキスト.destination);
    発振器.start();
    発振器.stop(コンテキスト.currentTime + 0.25);
  }
}
