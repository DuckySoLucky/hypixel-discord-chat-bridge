import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import {
  type DuelsInternalName,
  type DuelsModSearch,
  DuelsModeAliastoInternalMap,
  type DuelsModeName,
  DuelsModeNames,
  type MinecraftManagerWithBot,
  type ParsedDuelsStats
} from "../../types/minecraft.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { Player } from "hypixel-api-reborn";

class DuelsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("duels")
      .setDescription("Duel stats of specified user.")
      .setAliases(["d"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  convertMode(mode: DuelsModeName): DuelsInternalName {
    return DuelsModeAliastoInternalMap[mode] as DuelsInternalName;
  }

  getStats(hypixelPlayer: Player, mode: DuelsModSearch): ParsedDuelsStats {
    let stats;

    if (mode === "overall") {
      stats = hypixelPlayer.stats.Duels;
    } else {
      const internal = this.convertMode(mode);
      stats = hypixelPlayer.stats.Duels[internal];
    }

    const { title, kills, KDR, wins, WLR, winStreak, bestWinStreak } = stats;
    return { title, kills, KDR, wins, WLR, winStreak, bestWinStreak };
  }

  override async execute(player: string, message: string) {
    const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));

    const arg0 = msg[0];
    const arg1 = msg[1];

    let mode: DuelsModSearch = "overall";

    if (arg0 && DuelsModeNames.includes(arg0 as any)) {
      mode = arg0 as DuelsModeName;
      if (arg1) player = arg1;
    } else if (arg0) {
      player = arg0;
    }

    const hypixelPlayer = await getPlayer(player);
    const { title, kills, KDR, wins, WLR, winStreak, bestWinStreak } = this.getStats(hypixelPlayer, mode);
    const parsedTitle = title ? `[${title}] ` : "";
    this.send(
      `${parsedTitle}${hypixelPlayer.nickname}'s ${mode} Kills: ${formatNumber(kills)} KDR: ${KDR} | Wins: ${formatNumber(wins)} WLR: ${WLR} | WS: ${winStreak} BWS: ${
        bestWinStreak
      }`
    );
  }
}

export default DuelsCommand;
