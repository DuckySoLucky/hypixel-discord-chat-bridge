import HypixelAPIReborn from "../../private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

class GuildExperienceCommand extends MinecraftCommand {
  override readonly data: MinecraftCommandData;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("guildexp")
      .setDescription("Guilds experience of specified user.")
      .setAliases(["gexp"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const guild = await HypixelAPIReborn.getGuild("player", player).then((data) => {
      if (data.parsed === null) throw new HypixelDiscordChatBridgeError("Player is not in a guild");
      return data.parsed;
    });
    if (guild.me === null) throw new HypixelDiscordChatBridgeError("Player is not in a guild");
    const { weeklyExperience } = guild.me;
    await this.send(`${player}'s Weekly Guild Experience: ${weeklyExperience.toLocaleString()}.`);
  }
}

export default GuildExperienceCommand;
