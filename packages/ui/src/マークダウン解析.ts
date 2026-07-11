// メッセージ本文の簡易Markdown解析。太字(**)・インラインコード(`)・コードブロック(```)
// だけを扱う。テキストを判別共用体のセグメントに分解し、描画側（本文View）が
// SengenUIコンポーネントを組み立てる。innerHTMLは一切使わないためXSS安全
// （全テキストはtextContent経由でDOMに入る）

export type インライン断片 =
  | { readonly 種別: "平文"; readonly テキスト: string }
  | { readonly 種別: "太字"; readonly テキスト: string }
  | { readonly 種別: "インラインコード"; readonly テキスト: string };

export type 本文ブロック =
  | { readonly 種別: "文章"; readonly インライン一覧: readonly インライン断片[] }
  | { readonly 種別: "コードブロック"; readonly コード: string };

interface インライントークン {
  readonly 種別: "太字" | "インラインコード";
  readonly 開始: number;
  readonly 本体開始: number;
  readonly 本体終了: number;
  readonly 終了: number;
}

// 最も左にある「閉じが存在するトークン」を探す。閉じが無い記号は平文として扱う
function 次のトークンを探す(テキスト: string, 探索開始: number): インライントークン | null {
  for (let 位置 = 探索開始; 位置 < テキスト.length; 位置 += 1) {
    if (テキスト.startsWith("**", 位置)) {
      const 閉じ = テキスト.indexOf("**", 位置 + 2);
      if (閉じ > 位置 + 2) {
        return {
          種別: "太字",
          開始: 位置,
          本体開始: 位置 + 2,
          本体終了: 閉じ,
          終了: 閉じ + 2,
        };
      }
      // 閉じ無し・中身空("****")はトークン扱いしない。次の1文字から探索を続ける
      continue;
    }
    if (テキスト[位置] === "`") {
      const 閉じ = テキスト.indexOf("`", 位置 + 1);
      if (閉じ > 位置 + 1) {
        return {
          種別: "インラインコード",
          開始: 位置,
          本体開始: 位置 + 1,
          本体終了: 閉じ,
          終了: 閉じ + 1,
        };
      }
      continue;
    }
  }
  return null;
}

export function インラインを解析する(テキスト: string): インライン断片[] {
  const 断片一覧: インライン断片[] = [];
  const 平文を積む = (平文: string): void => {
    if (平文.length > 0) {
      断片一覧.push({ 種別: "平文", テキスト: 平文 });
    }
  };

  let 位置 = 0;
  while (位置 < テキスト.length) {
    const トークン = 次のトークンを探す(テキスト, 位置);
    if (トークン === null) {
      平文を積む(テキスト.slice(位置));
      break;
    }
    平文を積む(テキスト.slice(位置, トークン.開始));
    断片一覧.push({
      種別: トークン.種別,
      テキスト: テキスト.slice(トークン.本体開始, トークン.本体終了),
    });
    位置 = トークン.終了;
  }
  return 断片一覧;
}

function フェンス行か(行: string): boolean {
  return 行.trimStart().startsWith("```");
}

export function 本文を解析する(本文: string): 本文ブロック[] {
  const ブロック一覧: 本文ブロック[] = [];
  const 行一覧 = 本文.split("\n");
  let 文章バッファ: string[] = [];

  const 文章を確定する = (): void => {
    const テキスト = 文章バッファ.join("\n");
    文章バッファ = [];
    // コードブロック前後の余白だけの文章は描画しない（空のdivが並ぶのを防ぐ）
    if (テキスト.trim().length === 0) return;
    ブロック一覧.push({ 種別: "文章", インライン一覧: インラインを解析する(テキスト) });
  };

  let 行番号 = 0;
  while (行番号 < 行一覧.length) {
    const 行 = 行一覧[行番号] ?? "";
    if (フェンス行か(行)) {
      文章を確定する();
      const コード行一覧: string[] = [];
      行番号 += 1;
      // 閉じフェンスが無い場合は末尾までをコードブロックとして扱う
      while (行番号 < 行一覧.length && !フェンス行か(行一覧[行番号] ?? "")) {
        コード行一覧.push(行一覧[行番号] ?? "");
        行番号 += 1;
      }
      行番号 += 1;
      ブロック一覧.push({ 種別: "コードブロック", コード: コード行一覧.join("\n") });
      continue;
    }
    文章バッファ.push(行);
    行番号 += 1;
  }
  文章を確定する();
  return ブロック一覧;
}
