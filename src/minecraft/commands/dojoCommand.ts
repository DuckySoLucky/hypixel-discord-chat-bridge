import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { SkyBlockMemberCrimsonIsleDojoMinigame } from "hypixel-api-reborn";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class DojoCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("dojo")
    .setDescription("Dojo Stats of specified user.")
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { belt } = profile.me.crimsonIsle.dojo;
    const formattedDojo = Object.entries(profile.me.crimsonIsle.dojo)
      .filter(([name, data]) => data instanceof SkyBlockMemberCrimsonIsleDojoMinigame)
      .map(([name, data]) => ({ name, stat: data.points }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, stat }) => `Best ${titleCase(name)}: ${formatNumber(stat)}`);

    await this.send(`${username}'s Belt: ${belt} | ${formattedDojo.join(" | ")}`);
  }
}

export default DojoCommand;
