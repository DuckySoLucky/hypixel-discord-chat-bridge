import ExtensionRegistry, { ExtensionRegistrationError } from "../src/extensions/ExtensionRegistry.js";
import assert from "node:assert/strict";
import test from "node:test";

test("normalizes extension identifiers and aliases", () => {
  const registry = new ExtensionRegistry<object>();
  const extension = {};

  registry.register(" Ping ", extension, [" P "]);

  assert.equal(registry.get("PING"), extension);
  assert.equal(registry.get("p"), extension);
  assert.deepEqual(registry.values(), [extension]);
});

test("rejects duplicate identifiers and aliases", () => {
  const registry = new ExtensionRegistry<object>();
  registry.register("ping", {}, ["latency"], "core");

  assert.throws(() => registry.register("PING", {}, [], "plugin"), ExtensionRegistrationError);
  assert.throws(() => registry.register("other", {}, ["LATENCY"], "plugin"), ExtensionRegistrationError);
  assert.equal(registry.size, 1);
});
