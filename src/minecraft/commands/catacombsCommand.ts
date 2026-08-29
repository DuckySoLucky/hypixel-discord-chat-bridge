import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

class CatacombsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("catacombs")
    .setDescription("Skyblock Dungeons Stats of specified user.")
    .setAliases(["cata", "dungeons"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level, classes, secrets } = profile.me.dungeons;

    const formattedClasses = Object.entries(classes)
      .filter(([name]) => !["average", "selected", "toString"].includes(name))
      .filter(([_, data]) => data.currentXp > 1)
      .map(([name, data]) => ({ name, level: data.levelWithProgress }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, level }) => `${formatNumber(level)}${name.charAt(0).toUpperCase()}`);

    await this.send(
      `${username}'s Catacombs: ${formatNumber(level.levelWithProgress)} | Selected Class: ${titleCase(classes.selected)} | Class Average: ${formatNumber(
        classes.average
      )} | Secrets Found: ${formatNumber(secrets)} | Classes: ${formattedClasses.join(", ")}`
    );
  }
}

export default CatacombsCommand;
