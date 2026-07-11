import { アプリシェル } from "./アプリシェル/アプリシェル";
import { 通知サービス } from "./通知サービス";
import { Relayクライアント } from "./通信/Relayクライアント";

// コンポジションルート。依存の生成と配線はここに集約する
new アプリシェル(new Relayクライアント(), new 通知サービス()).bodyにマウントする();
