import { toError } from "../utils/asyncUtils.js";
import type { BridgeEventMap } from "../types/bridge.js";

type BridgeEventName = keyof BridgeEventMap;
type BridgeEventListener<Event extends BridgeEventName> = (payload: BridgeEventMap[Event]) => Promise<void> | void;

class BridgeEventBus {
  readonly #listeners = new Map<BridgeEventName, Set<(payload: never) => Promise<void> | void>>();

  on<Event extends BridgeEventName>(event: Event, listener: BridgeEventListener<Event>): () => void {
    const listeners = this.#listeners.get(event) ?? new Set();
    listeners.add(listener as (payload: never) => Promise<void> | void);
    this.#listeners.set(event, listeners);
    return () => listeners.delete(listener as (payload: never) => Promise<void> | void);
  }

  async publish<Event extends BridgeEventName>(event: Event, payload: BridgeEventMap[Event]): Promise<void> {
    const listeners = this.#listeners.get(event);
    if (!listeners) return;
    const results = await Promise.allSettled([...listeners].map((listener) => Promise.resolve().then(() => listener(payload as never))));
    const rejected = results.find((result): result is PromiseRejectedResult => result.status === "rejected");
    if (rejected) throw toError(rejected.reason);
  }
}

export default BridgeEventBus;
