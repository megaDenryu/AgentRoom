export type インライン断片 =
  | { readonly 種別: "平文"; readonly テキスト: string }
  | { readonly 種別: "太字"; readonly テキスト: string }
  | { readonly 種別: "インラインコード"; readonly テキスト: string };

export type 本文ブロック =
  | { readonly 種別: "文章"; readonly インライン一覧: readonly インライン断片[] }
  | { readonly 種別: "コードブロック"; readonly コード: string };
