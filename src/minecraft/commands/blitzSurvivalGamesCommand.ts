import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { type BlitzSurvivalGamesData, type BlitzSurvivalGamesKitId, BlitzSurvivalGamesKitIds, type Player } from "hypixel-api-reborn";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
type BlitzSurvivalGamesKitKey = Exclude<BlitzSurvivalGamesKitId, "shadow knight" | "hype train"> | "shadowKnight" | "hypeTrain";
class BlitzSurvivalGamesCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("blitzsurvivalgames")
      .setDescription("Blitz Survival Games stats of specified user.")
      .setAliases(["blitz", "blitzsg", "bsg"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  convertKit(mode: BlitzSurvivalGamesKitId): BlitzSurvivalGamesKitKey {
    switch (mode) {
      case "shadow knight":
        return "shadowKnight";
      case "hype train":
        return "hypeTrain";
      default:
        return mode;
    }
  }

  getStats(hypixelPlayer: Player, kit: BlitzSurvivalGamesKitId | "overall") {
    let stats: BlitzSurvivalGamesData;
    if (kit === "overall") stats = hypixelPlayer.stats.BlitzSurvivalGames;
    else stats = hypixelPlayer.stats.BlitzSurvivalGames[this.convertKit(kit)];
    const { coins, defaultKit } = hypixelPlayer.stats.BlitzSurvivalGames;
    const { wins, kills, KDRatio, WLRatio } = stats;
    return { wins, kills, KDRatio, WLRatio, coins, defaultKit };
  }

  override async execute(player: string, message: string) {
    const msg = this.getArgs(message).map((arg) => arg.replaceAll("/", "").toLowerCase());
    const modes = BlitzSurvivalGamesKitIds;
    const isKit = modes.includes(msg[0] as BlitzSurvivalGamesKitId);

    const mode: BlitzSurvivalGamesKitId | "overall" = isKit ? (msg[0] as BlitzSurvivalGamesKitId) : "overall";
    player = isKit ? msg[1] || player : msg[0] || player;

    const hypixelPlayer = await getPlayer(player);
    const { kills, KDRatio, wins, WLRatio, coins, defaultKit } = this.getStats(hypixelPlayer, mode);
    this.send(
      `${hypixelPlayer.nickname}'s BlitzSG ${mode === "overall" ? `kit: ${defaultKit} |` : mode} Kills: ${formatNumber(kills)} KDR: ${KDRatio} | Wins: ${formatNumber(
        wins
      )} WLR: ${WLRatio} | Coins: ${formatNumber(coins)}`
    );
  }
}

export default BlitzSurvivalGamesCommand;
