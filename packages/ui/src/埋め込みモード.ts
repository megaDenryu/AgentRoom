export function Jimbo埋め込み中か(search: string = window.location.search): boolean {
  return new URLSearchParams(search).get("host") === "jimbo";
}

export function 埋め込み表示対象か(id: string, Jimbo埋め込み中: boolean): boolean {
  return !Jimbo埋め込み中 || (id !== "札場" && id !== "キャラ");
}
