import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import {
  type DuelsInternalName,
  type DuelsModSearch,
  DuelsModeAliastoInternalMap,
  type DuelsModeName,
  DuelsModeNames,
  type MinecraftManagerWithBot
} from "../../types/minecraft.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { DuelsModeFull, Player } from "hypixel-api-reborn";

class DuelsCommand extends MinecraftCommand {
  override readonly data: MinecraftCommandData;
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

  getStats(hypixelPlayer: Player, mode: DuelsModSearch): DuelsModeFull {
    let stats;

    if (mode === "overall") {
      stats = hypixelPlayer.stats.Duels;
    } else {
      const internal = this.convertMode(mode);
      stats = hypixelPlayer.stats.Duels[internal];
    }

    return stats as DuelsModeFull;
  }

  override async execute(player: string, message: string) {
    const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));

    const arg0 = msg[0];
    const arg1 = msg[1];

    let mode: DuelsModSearch = "overall";

    if (arg0 && DuelsModeNames.includes(arg0)) {
      mode = arg0 as DuelsModeName;
      if (arg1) player = arg1;
    } else if (arg0) {
      player = arg0;
    }

    const hypixelPlayer = await getPlayer(player);
    const { title, kills, killDeathRatio, wins, winLossRatio, winstreak, winstreakBest } = this.getStats(hypixelPlayer, mode);
    const parsedTitle = title ? `[${title}] ` : "";
    await this.send(
      `${parsedTitle}${hypixelPlayer.nickname}'s ${mode} Kills: ${formatNumber(kills)} KDR: ${killDeathRatio} | Wins: ${formatNumber(wins)} WLR: ${
        winLossRatio
      } | WS: ${winstreak} BWS: ${winstreakBest}`
    );
  }
}

export default DuelsCommand;
