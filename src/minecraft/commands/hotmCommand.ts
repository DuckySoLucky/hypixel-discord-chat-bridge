import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { SkyBlockMemberMiningPowder } from "hypixel-api-reborn";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class HotmCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("hotm")
    .setDescription("Skyblock Hotm Stats of specified user.")
    .setAliases(["mining"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level } = profile.me.skillTrees.mining;
    const { powder, pickaxeAbility } = profile.me.mining;
    const formattedPowder = Object.entries(powder)
      .filter(([name, data]) => data instanceof SkyBlockMemberMiningPowder)
      .map(([name, data]) => ({ name, stat: data.total }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, stat }) => `${titleCase(name)} Powder: ${formatNumber(stat)}`);
    await this.send(`${username}'s Hotm: ${level.level} | Selected Ability: ${pickaxeAbility} | ${formattedPowder.join(" | ")}`);
  }
}

export default HotmCommand;
