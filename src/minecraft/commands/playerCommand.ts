import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getPlayer } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class PlayerCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("player")
      .setDescription("Get Hypixel Player Stats")
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player, { guild: true });
    const { formattedNickname, karma, level, guild, achievements } = hypixelPlayer;
    const guildName = guild ? guild.name : "None";
    this.send(
      `${formattedNickname}'s level: ${level.level} | Karma: ${formatNumber(karma, 0)} | Achievement Points: ${formatNumber(achievements.points, 0)} Guild: ${guildName}`
    );
  }
}

export default PlayerCommand;
