import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class EightBallCommand extends MinecraftCommand {
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
    const { selectedClass, finalKills, FKDR, wins, WLR, kills, KDR, assists } = hypixelPlayer.stats.MegaWalls;
    this.send(
      `${player}'s Megawalls: Class: ${selectedClass} | FK: ${finalKills} | FKDR: ${FKDR} | W: ${wins} | WLR: ${WLR} | K: ${kills} | KDR: ${KDR} | A: ${assists}`
    );
  }
}

export default EightBallCommand;
