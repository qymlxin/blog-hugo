#!/usr/bin/env node
import { build } from "esbuild";
import { chromium } from "playwright";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT, "static", "diagrams", "source");
const OUTPUT_DIR = path.join(ROOT, "static", "diagrams", "generated");
const ENTRY = path.join(ROOT, "scripts", "excalidraw-browser-entry.mjs");

const parseArgs = (args) => ({
  clean: args.includes("--clean"),
  sourceDir: args.includes("--source")
    ? path.resolve(args[args.indexOf("--source") + 1])
    : SOURCE_DIR,
  outputDir: args.includes("--output")
    ? path.resolve(args[args.indexOf("--output") + 1])
    : OUTPUT_DIR,
});

const walk = async (directory) => {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (entry.isFile() && entry.name.endsWith(".excalidraw")) files.push(absolute);
  }
  return files.sort();
};

const outputPath = (input, sourceDir, outputDir, suffix) => {
  const relative = path.relative(sourceDir, input);
  const withoutExtension = relative.replace(/\.excalidraw$/i, "");
  return path.join(outputDir, `${withoutExtension}${suffix}.svg`);
};

const findChromiumExecutable = () => {
  if (process.env.EXCALIDRAW_CHROMIUM_PATH) {
    return process.env.EXCALIDRAW_CHROMIUM_PATH;
  }
  const defaultPath = chromium.executablePath();
  if (existsSync(defaultPath)) return defaultPath;
  if (process.platform === "darwin") {
    const installedBrowser = defaultPath
      .replace("chromium_headless_shell-", "chromium-")
      .replace("/headless_shell", "/Chromium.app/Contents/MacOS/Chromium");
    if (existsSync(installedBrowser)) return installedBrowser;
  }
  return undefined;
};

const createBundle = async () => {
  const result = await build({
    entryPoints: [ENTRY],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2022",
    minify: true,
    write: false,
    legalComments: "none",
  });
  return result.outputFiles[0].text;
};

const render = async (browser, bundle, diagram, options) => {
  const page = await browser.newPage();
  try {
    await page.setContent("<!doctype html><html><body></body></html>");
    await page.addScriptTag({ content: bundle });
    return await page.evaluate(
      async ({ source, renderOptions }) => window.renderExcalidraw(source, renderOptions),
      { source: diagram, renderOptions: options },
    );
  } finally {
    await page.close();
  }
};

const main = async () => {
  const { clean, sourceDir, outputDir } = parseArgs(process.argv.slice(2));
  const sources = await walk(sourceDir);

  if (clean) await rm(outputDir, { recursive: true, force: true });
  if (sources.length === 0) {
    console.log(`No .excalidraw files found in ${path.relative(ROOT, sourceDir) || sourceDir}`);
    return;
  }

  await mkdir(outputDir, { recursive: true });
  const bundle = await createBundle();
  const executablePath = findChromiumExecutable();
  if (!executablePath) {
    throw new Error(
      "Chromium is required for Excalidraw export. Run `npm run diagrams:setup` or set EXCALIDRAW_CHROMIUM_PATH.",
    );
  }
  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });
  try {
    for (const sourcePath of sources) {
      const relative = path.relative(ROOT, sourcePath);
      const diagram = JSON.parse(await readFile(sourcePath, "utf8"));
      const name = path.basename(sourcePath, ".excalidraw");
      const lightPath = outputPath(sourcePath, sourceDir, outputDir, "");
      const darkPath = outputPath(sourcePath, sourceDir, outputDir, ".dark");
      await mkdir(path.dirname(lightPath), { recursive: true });

      const common = {
        alt: diagram.appState?.name || name,
        background: "#f8f7f3",
        exportBackground: false,
      };
      const lightSvg = await render(browser, bundle, diagram, common);
      const darkSvg = await render(browser, bundle, diagram, {
        ...common,
        dark: true,
        background: "#20241f",
      });

      await writeFile(lightPath, `${lightSvg}\n`);
      await writeFile(darkPath, `${darkSvg}\n`);
      console.log(`Generated ${relative} -> ${path.relative(ROOT, lightPath)}, ${path.relative(ROOT, darkPath)}`);
    }
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
