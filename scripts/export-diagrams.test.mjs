import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const exporter = path.join(root, "scripts", "export-diagrams.mjs");

const scene = {
  type: "excalidraw",
  version: 2,
  source: "https://excalidraw.com",
  elements: [
    {
      id: "test-ellipse",
      type: "ellipse",
      x: 20,
      y: 20,
      width: 200,
      height: 100,
      angle: 0,
      strokeColor: "#48634d",
      backgroundColor: "#dce5d8",
      fillStyle: "hachure",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      groupIds: [],
      roundness: null,
      seed: 1041657908,
      version: 1,
      versionNonce: 1188004276,
      isDeleted: false,
      frameId: null,
      boundElements: null,
      updated: 1,
      link: null,
      locked: false,
      index: "a0",
    },
  ],
  appState: { viewBackgroundColor: "#ffffff", gridSize: null },
  files: {},
};

test("exports light and dark SVGs from an Excalidraw file", async () => {
  const sourceDir = await mkdtemp(path.join(os.tmpdir(), "qymlxin-diagram-source-"));
  const outputDir = await mkdtemp(path.join(os.tmpdir(), "qymlxin-diagram-output-"));
  const sourcePath = path.join(sourceDir, "flow.excalidraw");

  try {
    await writeFile(sourcePath, `${JSON.stringify(scene)}\n`);
    await execFileAsync(process.execPath, [exporter, "--source", sourceDir, "--output", outputDir], {
      cwd: root,
      maxBuffer: 1024 * 1024,
    });

    const light = await readFile(path.join(outputDir, "flow.svg"), "utf8");
    const dark = await readFile(path.join(outputDir, "flow.dark.svg"), "utf8");
    assert.match(light, /svg-source:excalidraw/);
    assert.match(dark, /svg-source:excalidraw/);
    assert.notEqual(light, dark);
    assert.doesNotMatch(light, /fill="#f8f7f3"/);
  } finally {
    await Promise.all([
      rm(sourceDir, { recursive: true, force: true }),
      rm(outputDir, { recursive: true, force: true }),
    ]);
  }
});
