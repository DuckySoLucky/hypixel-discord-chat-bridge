import ExtensionRegistry from "../extensions/ExtensionRegistry.js";
import loadExtensionModules from "../extensions/moduleLoader.js";
import type Application from "../Application.js";
import type BasicScript from "./BasicScript.js";
import type { Lifecycle } from "../core/Lifecycle.js";

class ScriptManager implements Lifecycle {
  readonly #scripts = new ExtensionRegistry<BasicScript>();
  private loaded: boolean = false;
  constructor(
    readonly application: Application,
    private readonly deployScripts: boolean
  ) {}

  async start(): Promise<void> {
    if (!this.deployScripts) return;
    if (!this.loaded) {
      const modules = await loadExtensionModules<BasicScript, ScriptManager>(new URL("./scripts/", import.meta.url), this);
      for (const { extension, source } of modules) this.#scripts.register(extension.id, extension, [], source);
      this.loaded = true;
    }
    for (const script of this.#scripts.values()) await script.start();
    console.scripts(`Successfully loaded ${this.#scripts.size} script(s).`);
  }

  async stop(): Promise<void> {
    await Promise.allSettled(this.#scripts.values().map((script) => script.stop()));
  }

  get scripts(): readonly BasicScript[] {
    return this.#scripts.values();
  }

  getScript(id: string): BasicScript | undefined {
    return this.#scripts.get(id);
  }

  registerScript(script: BasicScript, source: string = "programmatic"): void {
    this.#scripts.register(script.id, script, [], source);
  }
}

export default ScriptManager;
