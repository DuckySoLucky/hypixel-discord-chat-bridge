import BridgeEventBus from "../src/private/BridgeEventBus.js";
import assert from "node:assert/strict";
import test from "node:test";

test("dispatches typed bridge events and disposes listeners", async () => {
  const events = new BridgeEventBus();
  const received: string[] = [];
  const dispose = events.on("clean-embed", (event) => {
    received.push(event.message);
  });

  await events.publish("clean-embed", { chatType: "Guild", message: "first", color: "Blue" });
  dispose();
  await events.publish("clean-embed", { chatType: "Guild", message: "second", color: "Blue" });

  assert.deepEqual(received, ["first"]);
});

test("runs every bridge listener and propagates listener failures", async () => {
  const events = new BridgeEventBus();
  let successfulListenerRan = false;
  events.on("clean-embed", () => {
    throw new Error("listener failed");
  });
  events.on("clean-embed", () => {
    successfulListenerRan = true;
  });

  await assert.rejects(events.publish("clean-embed", { chatType: "Guild", message: "test", color: "Blue" }), /listener failed/u);
  assert.equal(successfulListenerRan, true);
});
