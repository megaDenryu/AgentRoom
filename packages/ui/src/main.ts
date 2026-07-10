import { アプリシェル } from "./アプリシェル";
import { Relayクライアント } from "./通信/Relayクライアント";

// コンポジションルート。依存の生成と配線はここに集約する
new アプリシェル(new Relayクライアント()).bodyにマウントする();
