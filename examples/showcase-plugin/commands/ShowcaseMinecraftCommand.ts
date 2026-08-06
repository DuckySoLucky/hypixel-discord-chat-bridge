import { MinecraftCommand, MinecraftCommandData } from "../../../src/plugin-api.js";
import type { MinecraftManager } from "../../../src/plugin-api.js";

class ShowcaseMinecraftCommand extends MinecraftCommand<MinecraftManager> {
  override readonly data = new MinecraftCommandData().setName("pluginshowcase").setDescription("Demonstrate a plugin-provided Minecraft command.").setAliases(["pshow"]);

  override async execute(player: string): Promise<void> {
    await this.send(`Hello ${player}. This response stays in ${this.context.channel} chat.`);
  }
}

export default ShowcaseMinecraftCommand;
