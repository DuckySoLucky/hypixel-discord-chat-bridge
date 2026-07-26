import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { SkyBlockMemberCrimsonIsleTrophyFish, SkyBlockMemberCrimsonIsleTrophyFishFish } from "hypixel-api-reborn";

// CREDITS: by @Kathund (https://github.com/Kathund)
class TrophyFishCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("trophyfish")
      .setAliases(["tf", "trophyfishing", "trophy"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);

    const trophyFishing = profile.me.crimsonIsle.trophyFishing;
    const { bronze, silver, gold, diamond, total } = trophyFishing.caught;

    let uniqueBronze = 0;
    let uniqueSilver = 0;
    let uniqueGold = 0;
    let uniqueDiamond = 0;

    (Object.keys(trophyFishing) as (keyof SkyBlockMemberCrimsonIsleTrophyFish)[])
      .filter((fish) => !["toString", "rank", "caught"].includes(fish as string))
      .forEach((fishName) => {
        const fish = trophyFishing[fishName] as SkyBlockMemberCrimsonIsleTrophyFishFish;
        if (fish.bronze > 1) uniqueBronze++;
        if (fish.gold > 1) uniqueSilver++;
        if (fish.gold > 1) uniqueGold++;
        if (fish.diamond > 1) uniqueDiamond++;
      });

    this.send(
      translate("minecraft.commands.trophyfish.execute.success.message", {
        username,
        rank: translate(`minecraft.commands.trophyfish.execute.success.rank.${trophyFishing.rank}`),
        uniqueBronze,
        totalBronze: formatNumber(bronze),
        uniqueSilver,
        totalSilver: formatNumber(silver),
        uniqueGold,
        totalGold: formatNumber(gold),
        uniqueDiamond,
        totalDiamond: formatNumber(diamond),
        total: formatNumber(total)
      })
    );
  }
}

export default TrophyFishCommand;
