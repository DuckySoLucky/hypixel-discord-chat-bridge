import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCaseCamel } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class GardenCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("garden")
    .setDescription("Skyblock Garden Stats of specified user.")
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  private readonly keyRemap: Record<string, string> = {
    "Nether Wart": "Wart",
    "Sugar Cane": "Cane",
    "Sun Flower": "SF",
    "Wild Rose": "WR",
    "Cocoa Beans": "Cocoa",
    "Average": "Avg"
  };

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player, { garden: true });
    if (profile.garden === null) throw new HypixelDiscordChatBridgeError(`${username} does not have a garden.`);

    const milestoneString = Object.entries(profile.garden.parsed.cropMilestones)
      .filter(([key]) => key !== "toString")
      .sort(([a], [b]) => {
        if (a === "average") return -1;
        if (b === "average") return 1;
        return a.localeCompare(b);
      })
      .map(([key, value]) => {
        const rawName = titleCaseCamel(key);
        const name = this.keyRemap[rawName] !== undefined ? this.keyRemap[rawName] : rawName;
        return `${name}: ${key === "average" ? formatNumber(value, 2) : value.level}`;
      })
      .join(" | ");

    await this.send(`${username}'s Garden ${profile.garden.parsed.level.level} | Milestones: ${milestoneString}`);
  }
}

export default GardenCommand;
