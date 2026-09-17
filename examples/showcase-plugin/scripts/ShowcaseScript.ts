import { BasicScript, type BridgePluginLogger, type ScriptManagerWithPlugin } from "hypixel-discord-chat-bridge/plugin-api";
import type ShowcasePlugin from "../index.js";
import type { ShowcasePluginConfig } from "../config.js";

class ShowcaseScript extends BasicScript<ScriptManagerWithPlugin<ShowcasePlugin>> {
  constructor(
    scripts: ScriptManagerWithPlugin<ShowcasePlugin>,
    private readonly logger: BridgePluginLogger,
    config: ShowcasePluginConfig["scripts"]["showcase"]
  ) {
    super(scripts, { id: "showcase-script", enabled: config.enabled, schedule: { type: "interval", milliseconds: config.intervalMilliseconds }, overlap: "skip" });
  }

  override execute(signal: AbortSignal): Promise<void> {
    if (!signal.aborted) this.logger.info("The showcase script executed.");
    return Promise.resolve();
  }
}

export default ShowcaseScript;
