import { MinecraftCommand, MinecraftCommandData, type MinecraftManagerWithPlugin } from "hypixel-discord-chat-bridge/plugin-api";
import type ShowcasePlugin from "../index.ts";

class ShowcaseMinecraftCommand extends MinecraftCommand<MinecraftManagerWithPlugin<ShowcasePlugin>> {
  override readonly data = new MinecraftCommandData().setName("pluginshowcase").setDescription("Demonstrate a plugin-provided Minecraft command.").setAliases(["pshow"]);

  override async execute(player: string): Promise<void> {
    await this.send(`Hello ${player}. This response stays in ${this.context.channel} chat.`);
  }
}

export default ShowcaseMinecraftCommand;
