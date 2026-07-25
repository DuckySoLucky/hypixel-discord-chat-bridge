import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { type BedWarsInternalName, type BedWarsModeName, type MinecraftManagerWithBot, isBedWarsModeName } from "../../types/minecraft.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { BedWarsMode, Player } from "hypixel-api-reborn";

class BedwarsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("bedwars")
      .setDescription("BedWars stats of specified user.")
      .setAliases(["bw", "bws"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft username")]);
  }

  convertMode(mode: BedWarsModeName): BedWarsInternalName {
    switch (mode) {
      case "solo":
        return "eightOne";
      case "doubles":
        return "eightTwo";
      case "threes":
        return "fourThree";
      case "fours":
        return "fourFour";
      case "4v4":
        return "twoFour";
      default:
        return "eightOne";
    }
  }

  getStats(hypixelPlayer: Player, mode: BedWarsModeName) {
    let stats: BedWarsMode;
    if (mode === "overall") stats = hypixelPlayer.stats.BedWars;
    else stats = hypixelPlayer.stats.BedWars[this.convertMode(mode)];
    const { finals, wins, winstreak } = stats;
    const { broken, ratio } = stats.beds;
    return { finalKills: finals.total.kills, FKDR: finals.total.ratio, wins, winstreak, broken, BLRatio: ratio };
  }

  override async execute(player: string, message: string) {
    const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));

    const arg0 = msg[0];
    const arg1 = msg[1];

    let mode: BedWarsModeName = "overall";

    if (arg0 && isBedWarsModeName(arg0)) {
      mode = arg0;
      if (arg1) player = arg1;
    } else if (arg0) {
      player = arg0;
    }

    const hypixelPlayer = await getPlayer(player);
    const { finalKills, FKDR, wins, winstreak, broken, BLRatio } = this.getStats(hypixelPlayer, mode);

    this.send(
      `[${Math.floor(hypixelPlayer.stats.BedWars.level)}✫] ${hypixelPlayer.nickname} ${mode} FK: ${formatNumber(
        finalKills
      )} FKDR: ${FKDR} W: ${formatNumber(wins)} BB: ${formatNumber(broken)} BLR: ${BLRatio} WS: ${winstreak}`
    );
  }
}

export default BedwarsCommand;
