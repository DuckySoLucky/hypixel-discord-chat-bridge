import assert from "node:assert/strict";
import isPluginEntry from "../src/plugins/pluginDiscovery.js";
import loadExtensionModules from "../src/extensions/moduleLoader.js";
import test from "node:test";
import { join, sep } from "node:path";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

function directoryUrl(path: string): URL {
  return pathToFileURL(`${path}${sep}`);
}

test("loads development TypeScript extension modules relative to a URL", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bridge-extensions-"));

  try {
    await writeFile(join(directory, "example.ts"), "export default class Example { constructor(context) { this.value = context.value; } }", "utf-8");
    const modules = await loadExtensionModules<{ readonly value: string }, { readonly value: string }>(directoryUrl(directory), { value: "loaded" });

    assert.equal(modules.length, 1);
    assert.equal(modules[0]?.extension.value, "loaded");
    assert.match(modules[0]?.source ?? "", /example\.ts$/u);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects malformed dynamic extension modules with their source", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bridge-extensions-"));

  try {
    await mkdir(join(directory, "nested"));
    await writeFile(join(directory, "nested", "invalid.ts"), "export const invalid = true;", "utf-8");

    await assert.rejects(loadExtensionModules(directoryUrl(directory), {}), /invalid extension module: .*invalid\.ts/iu);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("plugin discovery loads nested entrypoints without treating helper modules as plugins", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bridge-plugins-"));

  try {
    const pluginDirectory = join(directory, "showcase");
    await mkdir(pluginDirectory);
    await writeFile(join(pluginDirectory, "helper.ts"), "export default class Helper {}", "utf-8");
    await writeFile(join(pluginDirectory, "index.ts"), "export default class Plugin { constructor(context) { this.value = context.value; } }", "utf-8");

    const modules = await loadExtensionModules<{ readonly value: string }, { readonly value: string }>(directoryUrl(directory), { value: "entry" }, isPluginEntry);
    assert.equal(modules.length, 1);
    assert.equal(modules[0]?.extension.value, "entry");
    assert.match(modules[0]?.source ?? "", /showcase\/index\.ts$/u);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
