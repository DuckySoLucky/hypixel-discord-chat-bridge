import assert from "node:assert/strict";
import test from "node:test";
import { safeListener } from "../src/utils/asyncUtils.js";

test("safeListener reports asynchronous listener failures", async () => {
  const reported = new Promise<unknown>((resolve) => {
    const listener = safeListener(() => Promise.reject(new Error("listener failed")), resolve);
    listener();
  });

  const error = await reported;
  assert.match(String(error), /listener failed/u);
});
