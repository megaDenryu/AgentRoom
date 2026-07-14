// 文書索引エントリのリポジトリ名として登録してよい名前の集合。Jimbo配下の全submoduleを
// 自動許可する方針(ユーザー決定事項2026-07-15、明示登録制は不採用)のため、実体は
// infra/許可リポジトリ読み込み.ts が.gitmodulesを読んで動的に構築する。ここでは
// 判定のためのドメイン型だけを持つ
export class 許可リポジトリ一覧 {
  private readonly 内部集合: ReadonlySet<string>;

  private constructor(名前一覧: readonly string[]) {
    this.内部集合 = new Set(名前一覧);
  }

  static create(名前一覧: readonly string[]): 許可リポジトリ一覧 {
    return new 許可リポジトリ一覧(名前一覧);
  }

  含むか(名前: string): boolean {
    return this.内部集合.has(名前);
  }

  get 値一覧(): readonly string[] {
    return [...this.内部集合];
  }
}
