import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class BuildBattleCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("buildbattle")
      .setDescription("Build Battle Stats of specified user.")
      .setAliases(["bb"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { title, tokens, score, wins, winsSpeedBuilders, winsGuessTheBuild } = hypixelPlayer.stats.BuildBattle;
    this.send(
      `${title} ${hypixelPlayer.nickname}'s Build Battle Wins: ${formatNumber(wins)} Speed Builders Wins: ${formatNumber(
        winsSpeedBuilders
      )} GTB Wins: ${formatNumber(winsGuessTheBuild)} | Score: ${formatNumber(score)} | Tokens: ${formatNumber(tokens)}`
    );
  }
}

export default BuildBattleCommand;
