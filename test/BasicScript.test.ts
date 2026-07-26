import BasicScript from "../src/scripts/BasicScript.js";
import assert from "node:assert/strict";
import test from "node:test";
import type ScriptManager from "../src/scripts/ScriptsManager.js";

class TestScript extends BasicScript {
  executions: number = 0;
  release?: () => void;

  override async execute(): Promise<void> {
    this.executions++;
    await new Promise<void>((resolve) => {
      this.release = resolve;
    });
  }

  protected override log(): Promise<void> {
    return Promise.resolve();
  }
}

const scripts = {} as ScriptManager;
const scriptConsole = console as Console & { scripts(message: string): void };
const originalScriptsLogger = scriptConsole.scripts;

test.before(() => {
  scriptConsole.scripts = () => undefined;
});

test.after(() => {
  scriptConsole.scripts = originalScriptsLogger;
});

test("disabled scripts create no scheduled execution", async () => {
  const script = new TestScript(scripts, { id: "disabled", enabled: false, schedule: { type: "interval", milliseconds: 1 } });

  await script.start();
  await new Promise((resolve) => setTimeout(resolve, 10));
  await script.stop();

  assert.equal(script.executions, 0);
});

test("scripts skip overlapping executions by default", async () => {
  const script = new TestScript(scripts, { id: "overlap", enabled: true, schedule: { type: "interval", milliseconds: 60_000 } });
  const first = script.runNow();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await script.runNow();

  assert.equal(script.executions, 1);
  script.release?.();
  await first;
  await script.stop();
});

test("stopping a script cancels its active interval", async () => {
  class ImmediateScript extends TestScript {
    override execute(): Promise<void> {
      this.executions++;
      return Promise.resolve();
    }
  }

  const script = new ImmediateScript(scripts, { id: "interval", enabled: true, schedule: { type: "interval", milliseconds: 5 } });
  await script.start();
  await new Promise((resolve) => setTimeout(resolve, 20));
  await script.stop();
  const executionsAfterStop = script.executions;
  await new Promise((resolve) => setTimeout(resolve, 15));

  assert.ok(executionsAfterStop > 0);
  assert.equal(script.executions, executionsAfterStop);
});
