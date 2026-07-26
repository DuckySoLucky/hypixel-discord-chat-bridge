import { toError } from "../utils/asyncUtils.js";
import type { Client } from "minecraft-protocol";
import type { PrismarineChatFormatter } from "prismarine-chat";

interface MinecraftRequestOptions<Result> {
  readonly description: string;
  readonly timeoutMs: number;
  readonly matches: (message: string) => boolean;
  readonly map: (message: string) => Result;
  readonly signal?: AbortSignal;
}

interface PendingRequest {
  readonly matches: (message: string) => boolean;
  readonly resolve: (message: string) => void;
  readonly reject: (error: Error) => void;
}

class MinecraftRequestTimeoutError extends Error {
  constructor(description: string) {
    super(`Minecraft request timed out: ${description}`);
    this.name = "MinecraftRequestTimeoutError";
  }
}

class MinecraftRequestBroker {
  readonly #pending = new Map<symbol, PendingRequest>();
  private client?: Client;
  private readonly listener = (packet: { formattedMessage: string }): void => {
    const message = this.chat.fromNotch(packet.formattedMessage).toString();
    for (const request of [...this.#pending.values()]) {
      if (request.matches(message)) request.resolve(message);
    }
  };

  constructor(private readonly chat: PrismarineChatFormatter) {}

  start(client: Client): void {
    if (this.client === client) return;
    this.stop(new Error("Minecraft request broker changed clients."));
    this.client = client;
    client.on("systemChat", this.listener);
  }

  stop(error: Error = new Error("Minecraft request broker stopped.")): void {
    this.client?.off("systemChat", this.listener);
    this.client = undefined;
    this.rejectAll(error);
  }

  request<Result>(options: MinecraftRequestOptions<Result>): Promise<Result> {
    if (!this.client) return Promise.reject(new Error("Minecraft request broker is not connected."));

    return new Promise<Result>((resolve, reject) => {
      const id = Symbol(options.description);
      let settled = false;
      const resources: { timeout?: NodeJS.Timeout; onAbort?: () => void } = {};

      const cleanup = (): void => {
        if (resources.timeout) clearTimeout(resources.timeout);
        if (resources.onAbort) options.signal?.removeEventListener("abort", resources.onAbort);
        this.#pending.delete(id);
      };
      const rejectRequest = (error: Error): void => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
      };
      const resolveRequest = (message: string): void => {
        if (settled) return;
        settled = true;
        cleanup();
        try {
          resolve(options.map(message));
        } catch (error: unknown) {
          reject(toError(error));
        }
      };
      resources.onAbort = (): void => rejectRequest(toError(options.signal?.reason ?? new Error(`${options.description} aborted.`)));
      resources.timeout = setTimeout(() => rejectRequest(new MinecraftRequestTimeoutError(options.description)), options.timeoutMs);

      if (options.signal?.aborted) {
        resources.onAbort();
        return;
      }

      options.signal?.addEventListener("abort", resources.onAbort, { once: true });
      this.#pending.set(id, { matches: options.matches, resolve: resolveRequest, reject: rejectRequest });
    });
  }

  rejectAll(error: Error): void {
    for (const request of [...this.#pending.values()]) request.reject(error);
  }

  get pendingCount(): number {
    return this.#pending.size;
  }
}

export { MinecraftRequestTimeoutError };
export type { MinecraftRequestOptions };
export default MinecraftRequestBroker;
