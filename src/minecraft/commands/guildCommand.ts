import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getGuild } from "../../utils/hypixelUtils.js";

class GuildCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("guild")
    .setDescription("View information of a guild")
    .setAliases(["g"])
    .setOptions([new MinecraftCommandDataOption().setName("guild").setRequired(true)]);

  override async execute(player: string, message: string) {
    const guild = await getGuild("name", this.getArgs(message).join(" "));
    if (guild === null) throw new HypixelDiscordChatBridgeError("Guild does not exist");
    const { name, tag, members, level, totalWeeklyGEXP } = guild;
    await this.send(`Guild ${name} | Tag: [${tag}] | Members: ${members.length} | Level: ${level} | Weekly GEXP: ${formatNumber(totalWeeklyGEXP)}`);
  }
}

export default GuildCommand;
