import NodeCache from "node-cache";
import type Application from "../Application.ts";

class CacheHandler {
  // Should cache things for an hour
  private readonly cache: NodeCache = new NodeCache({ stdTTL: 1 * 60 * 60, maxKeys: -1, checkperiod: 180 });
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
