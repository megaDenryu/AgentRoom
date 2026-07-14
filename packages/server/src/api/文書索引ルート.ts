import type { FastifyInstance } from "fastify";
import type { 許可リポジトリ一覧 } from "../domain/許可リポジトリ一覧.js";
import { 検証エラー } from "../domain/検証エラー.js";
import { 文書概要 } from "../domain/文書概要.js";
import { 文書パス } from "../domain/文書パス.js";
import { 文書リポジトリ名 } from "../domain/文書リポジトリ名.js";
import { 文書タイトル } from "../domain/文書タイトル.js";
import type { メッセージストア } from "../infra/メッセージストア.js";
import { 文書索引登録内容に絞る } from "./リクエスト検証.js";

// 仕様書・成果物のmd文書の索引(発見用の一覧)を担うルート群。文書本文はgit管理下の
// ファイルが正で、ここでは持たない・返さない(参照: Jimbo/ARCHITECTURE.md「Phase C設計」
// 推奨案・段階実装計画の第1歩)。登録できるリポジトリは許可リポジトリ一覧に載っている
// ものだけに絞り、Jimbo管理外のリポジトリ名が紛れ込むのを防ぐ
export function 文書索引ルートを登録する(
  app: FastifyInstance,
  依存: { ストア: メッセージストア; 許可リポジトリ一覧: 許可リポジトリ一覧 },
): void {
  const { ストア, 許可リポジトリ一覧 } = 依存;

  app.post("/api/documents", async (request) => {
    const 内容 = 文書索引登録内容に絞る(request.body);
    const リポジトリ = 文書リポジトリ名.create(内容.リポジトリ);
    if (!許可リポジトリ一覧.含むか(リポジトリ.値)) {
      throw new 検証エラー(
        `リポジトリ"${リポジトリ.値}"はJimbo配下のsubmoduleとして認識されていません`,
      );
    }
    const 登録後 = ストア.文書索引を登録または更新する(
      リポジトリ,
      文書パス.create(内容.パス),
      文書タイトル.create(内容.タイトル),
      文書概要.create(内容.概要),
    );
    return 登録後.toJSON();
  });

  app.get("/api/documents", async () => {
    return ストア.文書索引一覧を取得する().map((エントリ) => エントリ.toJSON());
  });
}
