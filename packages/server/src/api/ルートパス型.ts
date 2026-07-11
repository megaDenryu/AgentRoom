// Fastifyのルートパラメータ型。メッセージ/メンバー/既読の各ルート登録関数で共有する
export interface ルームパス {
  roomId: string;
}

export interface メンバーパス {
  roomId: string;
  name: string;
}
