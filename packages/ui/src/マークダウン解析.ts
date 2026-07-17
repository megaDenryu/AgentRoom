import { インラインを解析する } from "./インライン解析";
import type { 本文ブロック } from "./マークダウン型";

export type { インライン断片, 本文ブロック } from "./マークダウン型";
export { インラインを解析する } from "./インライン解析";

const フェンス行か = (line: string): boolean => line.trimStart().startsWith("```");

export function 本文を解析する(body: string): 本文ブロック[] {
  const blocks: 本文ブロック[] = [];
  const lines = body.split("\n");
  let prose: string[] = [];
  const 文章を確定する = (): void => {
    const text = prose.join("\n"); prose = [];
    if (text.trim().length > 0) blocks.push({ 種別: "文章", インライン一覧: インラインを解析する(text) });
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (!フェンス行か(line)) { prose.push(line); i += 1; continue; }
    文章を確定する();
    const code: string[] = []; i += 1;
    while (i < lines.length && !フェンス行か(lines[i] ?? "")) { code.push(lines[i] ?? ""); i += 1; }
    i += 1; blocks.push({ 種別: "コードブロック", コード: code.join("\n") });
  }
  文章を確定する();
  return blocks;
}
