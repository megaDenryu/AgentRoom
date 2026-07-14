// モバイルシェル配下で共有するdata-attribute状態定数(SengenUIガイド第13条)。
// 個別コンポーネントに閉じる単純なon/off(新着ジャンプボタンの表示可否等)は
// 各コンポーネントで直接setAttributeし、複数箇所から参照される状態だけをここに集約する

// 単一フルスクリーンビュー領域(ルーム一覧⇔会話)の表示切替
export const 画面表示状態 = {
  attribute: "data-screen-visibility",
  value: { 表示: "visible", 非表示: "hidden" },
} as const;

// ボトムシートの開閉
export const シート表示状態 = {
  attribute: "data-sheet-visibility",
  value: { 表示: "visible", 非表示: "hidden" },
} as const;

// 下部ナビの選択中タブ表示切替。選択の唯一の真実はモバイルシェルサービスが持つ現在画面で、
// 下部ナビはそこから指示された結果をこの属性へ反映するだけ
export const ナビ選択状態 = {
  attribute: "data-nav-selected",
  value: { 選択: "true", 非選択: "false" },
} as const;
