import NodeCache from "node-cache";
import ms from "ms";

class CacheHandler {
  private readonly cache: NodeCache = new NodeCache({ stdTTL: ms("1h"), maxKeys: -1, checkperiod: 180 });

  set<T>(key: string, value: T): T {
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
