import { fileInput, img, DivC, type ImgC } from "sengen-ui";
import * as styles from "./style.css";

// キャラアイコンの選択+プレビュー(モバイル専用のLV1拡張)。選択したファイルをdataURLへ
// 変換して内部に保持する(デスクトップのキャラタブ/キャラアイコン入力.tsと同型。
// シェル間の独立を保つため個別に持つ)
export class キャラアイコン入力 extends DivC {
  private _値 = "";
  private readonly _プレビュー: ImgC;

  constructor(アイコンalt: string) {
    super({ class: styles.アイコン入力 });
    this._プレビュー = img({ class: styles.アイコンプレビュー, alt: アイコンalt });
    const ファイル選択 = fileInput({ accept: "image/*", class: styles.ファイル選択 }).onFileSelected(
      (ファイル) => this._ファイルを読み込む(ファイル),
    );
    this.childs([this._プレビュー, ファイル選択]);
  }

  値を取得する(): string {
    return this._値;
  }

  値を設定する(dataUrl: string): this {
    this._値 = dataUrl;
    this._プレビュー.setSrc(dataUrl.length > 0 ? dataUrl : "");
    return this;
  }

  private _ファイルを読み込む(ファイル: File): void {
    const 読込器 = new FileReader();
    読込器.onload = () => {
      if (typeof 読込器.result === "string") {
        this.値を設定する(読込器.result);
      }
    };
    読込器.readAsDataURL(ファイル);
  }
}
