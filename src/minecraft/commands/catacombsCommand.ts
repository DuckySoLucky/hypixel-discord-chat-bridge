import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class CatacombsCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("catacombs")
      .setDescription("Skyblock Dungeons Stats of specified user.")
      .setAliases(["cata", "dungeons"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level } = profile.me.dungeons;
    const tank = formatNumber(profile.me.dungeons.classes.tank.level);
    const archer = formatNumber(profile.me.dungeons.classes.archer.level);
    const healer = formatNumber(profile.me.dungeons.classes.healer.level);
    const mage = formatNumber(profile.me.dungeons.classes.mage.level);
    const berserk = formatNumber(profile.me.dungeons.classes.berserk.level);

    this.send(
      `${username}'s Catacombs: ${formatNumber(level.level)} | Selected Class: ${profile.me.dungeons.classes.selected} | Class Average: ${formatNumber(
        profile.me.dungeons.classes.average
      )} | Secrets Found: ${formatNumber(profile.me.dungeons.secrets)} | Classes: ${healer}H, ${mage}M, ${berserk}B, ${archer}A, ${mage}M ${tank}T`
    );
  }
}

export default CatacombsCommand;
