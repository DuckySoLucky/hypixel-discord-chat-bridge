import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class EightBallCommand extends MinecraftCommand {
  override readonly data: MinecraftCommandData;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("megawalls")
      .setDescription("View the Megawalls stats of a player")
      .setAliases(["mw"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { selectedClass, finalKills, finalKillDeathRatio, wins, winLossRatio, kills, killDeathRatio, assists } = hypixelPlayer.stats.MegaWalls;
    await this.send(
      `${player}'s Megawalls: Class: ${selectedClass} | FK: ${finalKills} | FKDR: ${finalKillDeathRatio} | W: ${wins} | WLR: ${winLossRatio} | K: ${kills} | KDR: ${
        killDeathRatio
      } | A: ${assists}`
    );
  }
}

export default EightBallCommand;
