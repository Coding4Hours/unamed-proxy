import { mkdir } from "node:fs/promises";
import { build } from "esbuild";

await mkdir("dist");

let builder = await build({
  platform: "browser",
  sourcemap: true,
  minify: false,
  entryPoints: ['src/index.js'],
  bundle: true,
  treeShaking: true,
  logLevel: "info",
  outdir: "dist/",
});
