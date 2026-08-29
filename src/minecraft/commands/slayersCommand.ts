import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { SkyBlockMemberSlayer } from "hypixel-api-reborn";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

class SlayersCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("slayer")
    .setDescription("Slayer of specified user.")
    .setAliases(["slayers"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const formattedSlayers = Object.entries(profile.me.slayers)
      .filter(([_, data]) => data instanceof SkyBlockMemberSlayer)
      .map(([name, data]) => ({ name, stat: data.level.levelWithProgress, xp: data.level.xp }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, stat, xp }) => `${titleCase(name)}: ${stat} (${formatNumber(xp)})`);

    await this.send(`${username}'s Slayer: ${formattedSlayers.join(" | ")}`);
  }
}

export default SlayersCommand;
