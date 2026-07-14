import os from "node:os";

// LAN内の他端末(スマホ・タブレット・Jimbo等)からアクセス可能な、自機のプライベート
// IPv4アドレスを列挙する。ループバックは対象外(オリジン許可判定側でlocalhost・
// 127.0.0.1として別途固定値扱いするため、ここでは重複させない)。
// 参照: Jimbo側の同種実装(electron-app/src/main/AgentRoom/AgentRoomLanURL.ts)は
// LAN URL表示用に最優先の1件だけを返すが、CORSオリジン許可判定では自機の
// どのNICから届いたアクセスも許可したいため、ここでは全件を返す。
export function 自機のIPv4アドレス一覧を取得する(): readonly string[] {
  const 一覧: string[] = [];
  for (const エントリ一覧 of Object.values(os.networkInterfaces())) {
    for (const エントリ of エントリ一覧 ?? []) {
      if (エントリ.family === "IPv4" && !エントリ.internal) {
        一覧.push(エントリ.address);
      }
    }
  }
  return 一覧;
}
