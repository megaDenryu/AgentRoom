import { div, LV2HtmlComponentBase, 配線ポート, type DivC, type I配線可能 } from "sengen-ui";
import { 下部ナビ項目一覧, ルームナビ項目id } from "./ナビ項目一覧";
import { ナビ項目ボタン } from "./ナビ項目ボタン";
import * as styles from "./style.css";

export interface I下部ナビ配線 {
  on項目選択(id: string): void;
}

// 下部固定のタブナビゲーション(LV2素部品)。項目は下部ナビ項目一覧.tsの配列だけで決まるため、
// 新しいタブは項目を1件追加するだけで増やせる。選択中タブの見た目は選択する(id)で外部
// (モバイルシェルサービス)から指示された結果を反映するだけで、自身では選択状態を判断しない
export class 下部ナビ extends LV2HtmlComponentBase implements I配線可能<I下部ナビ配線> {
  protected _componentRoot: DivC;
  private readonly _配線 = new 配線ポート<I下部ナビ配線>("下部ナビ");
  private readonly _項目一覧: readonly ナビ項目ボタン[];

  constructor() {
    super();
    this._項目一覧 = 下部ナビ項目一覧.map((項目) =>
      new ナビ項目ボタン(項目).配線する({
        on選択: () => this._配線.先.on項目選択(項目.id),
      }),
    );
    this._componentRoot = this._ルートを構築する(this._項目一覧);
    this.選択する(ルームナビ項目id);
  }

  配線する(配線: I下部ナビ配線): this {
    this._配線.配線する(配線);
    return this;
  }

  選択する(id: string): void {
    for (const ボタン of this._項目一覧) {
      if (ボタン.項目id === id) ボタン.選択する();
      else ボタン.選択解除する();
    }
  }

  バッジ件数を設定する(id: string, 件数: number): void {
    this._項目一覧.find((項目) => 項目.項目id === id)?.バッジ件数を設定する(件数);
  }

  private _ルートを構築する(項目一覧: readonly ナビ項目ボタン[]): DivC {
    return div({ class: styles.下部ナビ }).childs(項目一覧);
  }
}
