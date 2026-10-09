import NodeCache from "node-cache";
import ms from "ms";
import type Application from "../Application.ts";

class CacheHandler {
  private readonly cache: NodeCache = new NodeCache({ stdTTL: ms("1h"), maxKeys: -1, checkperiod: 180 });
  constructor(private readonly application: Application) {}

  set<T>(key: string, value: T): T {
    if (!this.application.config.API.cache) return value;
    return this.cache.set(key, value) as T;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get<T>(key: string): T {
    return this.cache.get(key) as T;
  }

  keys(): string[] {
    return this.cache.keys();
  }

  size(): number {
    return this.cache.keys().length;
  }

  clear(): void {
    this.cache.flushAll();
  }
}

export default CacheHandler;
