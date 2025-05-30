import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { build } from "esbuild";
import { execSync } from "node:child_process";

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
