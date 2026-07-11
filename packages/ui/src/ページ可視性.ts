// タブの可視状態の読み取りと変化購読。SengenUIはdocumentレベルのイベントAPIを
// 持たないため、素のlistener使用はこのモジュールだけに閉じ込める

export function ページが非表示か(): boolean {
  return document.hidden;
}

export function ページが表示されたら(リスナ: () => void): () => void {
  const ハンドラ = (): void => {
    if (!document.hidden) {
      リスナ();
    }
  };
  document.addEventListener("visibilitychange", ハンドラ);
  return () => document.removeEventListener("visibilitychange", ハンドラ);
}
