import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class BestiaryCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("bestiary")
      .setDescription("Bestiary of specified user.")
      .setAliases(["be"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level, maxLevel, familyTiers, maxFamilyTiers, familiesUnlocked, totalFamilies, familiesCompleted } = profile.me.bestiary;
    const progress = formatNumber((profile.me.bestiary.level / profile.me.bestiary.maxLevel) * 100, 2);
    this.send(
      `${username}'s Bestiary: ${level} / ${maxLevel} (${progress}%) | Unlocked Tiers: ${familyTiers} / ${maxFamilyTiers} | Unlocked Families: ${familiesUnlocked} / ${
        totalFamilies
      } | Families Maxed: ${familiesCompleted}`
    );
  }
}

export default BestiaryCommand;
