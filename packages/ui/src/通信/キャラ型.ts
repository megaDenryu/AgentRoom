// Relay Server の「キャラ(人物)」台帳との通信境界の型。サーバー側
// packages/server/src/domain/キャラ.ts の toJSON() 形状と対応する。
// 外部境界なので unknown で受けて型ガードで絞る

export interface キャラDTO {
  readonly 名前: string;
  readonly 種別: string;
  readonly プロンプト: string;
  readonly アイコンdataUrl: string;
  readonly 行動パターンメモ: string;
  readonly 作成者: string;
  readonly 作成時刻: string;
  readonly 更新時刻: string;
}

// サーバー側 domain/キャラ種別.ts の許可値と対応する(キャラフォームの種別セレクトの選択肢)
export const キャラ種別一覧 = ["人間", "AI"] as const;

export function キャラDTOか(値: unknown): 値 is キャラDTO {
  return (
    typeof 値 === "object" &&
    値 !== null &&
    "名前" in 値 &&
    typeof 値.名前 === "string" &&
    "種別" in 値 &&
    typeof 値.種別 === "string" &&
    "プロンプト" in 値 &&
    typeof 値.プロンプト === "string" &&
    "アイコンdataUrl" in 値 &&
    typeof 値.アイコンdataUrl === "string" &&
    "行動パターンメモ" in 値 &&
    typeof 値.行動パターンメモ === "string" &&
    "作成者" in 値 &&
    typeof 値.作成者 === "string" &&
    "作成時刻" in 値 &&
    typeof 値.作成時刻 === "string" &&
    "更新時刻" in 値 &&
    typeof 値.更新時刻 === "string"
  );
}
