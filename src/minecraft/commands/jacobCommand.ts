import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class JacobCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("jacob")
      .setDescription("Jacob's Contest Stats of specified user.")
      .setAliases(["jacobs", "jacobcontest", "contest"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { gold, silver, bronze } = profile.me.jacobContests.medals;
    const { doubleDrops, farmingLevelCap } = profile.me.jacobContests.perks;
    this.send(
      `${username}'s Gold Medals: ${formatNumber(gold)} | Silver: ${formatNumber(silver)} | Bronze: ${formatNumber(bronze)} | Double Drops ${
        doubleDrops
      } / 15 | Level Cap: ${farmingLevelCap} / 10`
    );
  }
}

export default JacobCommand;
