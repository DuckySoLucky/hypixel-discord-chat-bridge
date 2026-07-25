import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class FairySoulsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("fairysouls")
      .setDescription("Fairy Souls of specified user.")
      .setAliases(["fs", "fairysoul"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { collected } = profile.me.fairySouls;
    const total = profile.gameMode === "island" ? 5 : 266;

    this.send(`${username}'s Fairy Souls: ${collected} / ${total} | Progress: ${((collected / total) * 100).toFixed(2)}%`);
  }
}

export default FairySoulsCommand;
