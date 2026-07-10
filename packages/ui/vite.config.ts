import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  server: {
    port: 7101,
    proxy: {
      "/ws": { target: "ws://localhost:7100", ws: true },
      "/api": { target: "http://localhost:7100" },
    },
  },
  resolve: {
    // SengenUI の package.json は dist を指すがビルド成果物はコミットされていないため、
    // ソース（index.ts）へ直接エイリアスする。サブパス import（sengen-ui/SengenBase/... 等）
    // も使われるので、完全一致とプレフィックス一致の2本立てにする
    alias: [
      {
        find: /^sengen-ui$/,
        replacement: path.resolve(__dirname, "../../submodules/SengenUI/index.ts"),
      },
      {
        find: /^sengen-ui\//,
        replacement: path.resolve(__dirname, "../../submodules/SengenUI") + "/",
      },
      {
        find: /^vscode-shell-layout$/,
        replacement: path.resolve(__dirname, "../../submodules/VscodeShellLayout/src/index.ts"),
      },
      {
        find: /^vscode-shell-layout\//,
        replacement: path.resolve(__dirname, "../../submodules/VscodeShellLayout/src") + "/",
      },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        // 日本語ファイル名由来のチャンク/アセット名はURLエンコード問題を踏むため、
        // ASCIIのハッシュベース名に固定する（参照実装 megadenryu_support_ui と同じ対処）
        entryFileNames: "assets/entry-[hash].js",
        chunkFileNames: "assets/chunk-[hash].js",
        assetFileNames: "assets/asset-[hash][extname]",
      },
    },
  },
});
