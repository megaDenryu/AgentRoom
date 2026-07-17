import type { インライン断片 } from "./マークダウン型";

interface トークン {
  readonly 種別: "太字" | "インラインコード"; readonly 開始: number;
  readonly 本体開始: number; readonly 本体終了: number; readonly 終了: number;
}

function 次を探す(text: string, start: number): トークン | null {
  for (let i = start; i < text.length; i += 1) {
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end > i + 2) return { 種別: "太字", 開始: i, 本体開始: i + 2, 本体終了: end, 終了: end + 2 };
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i + 1) return { 種別: "インラインコード", 開始: i, 本体開始: i + 1, 本体終了: end, 終了: end + 1 };
    }
  }
  return null;
}

export function インラインを解析する(text: string): インライン断片[] {
  const result: インライン断片[] = [];
  const 平文 = (value: string): void => { if (value.length > 0) result.push({ 種別: "平文", テキスト: value }); };
  let pos = 0;
  while (pos < text.length) {
    const token = 次を探す(text, pos);
    if (token === null) { 平文(text.slice(pos)); break; }
    平文(text.slice(pos, token.開始));
    result.push({ 種別: token.種別, テキスト: text.slice(token.本体開始, token.本体終了) });
    pos = token.終了;
  }
  return result;
}
