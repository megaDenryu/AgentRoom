import "./Fudabaテーマブリッジ.css";
import { アプリシェル } from "./アプリシェル/アプリシェル";
import { モバイルシェル } from "./モバイルシェル/モバイルシェル";
import { 通知サービス } from "./通知サービス";
import { Relayクライアント } from "./通信/Relayクライアント";
import { 初期表示モードを判定する } from "./表示モード切替";
import { Jimbo埋め込み中か } from "./埋め込みモード";

// コンポジションルート。依存の生成と配線、初期シェルの分岐(画面幅768px未満=モバイル)を
// ここに集約する。配信元(:7100)・REST・WSは共通で、シェルだけが専用構造に分かれる
// (ARCHITECTURE.md「ビュー層の設計原則」2026-07-14追記)
const クライアント = new Relayクライアント();
const Jimbo埋め込み中 = Jimbo埋め込み中か();
if (初期表示モードを判定する() === "mobile") {
  new モバイルシェル(クライアント, Jimbo埋め込み中).bodyにマウントする();
} else {
  new アプリシェル(クライアント, new 通知サービス(), Jimbo埋め込み中).bodyにマウントする();
}
