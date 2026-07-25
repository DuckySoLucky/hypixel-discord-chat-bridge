import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class EssenceCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("essence")
      .setDescription("Skyblock Dungeons Stats of specified user.")
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const essenceString = Object.entries(profile.me.currencies)
      .filter(([key]) => key.endsWith("Essence"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const name = key.replace("Essence", "");
        return `${titleCase(name)}: ${formatNumber(value as number)}`;
      })
      .join(", ");

    this.send(`${username}'s Essence: ${essenceString}`);
  }
}

export default EssenceCommand;
