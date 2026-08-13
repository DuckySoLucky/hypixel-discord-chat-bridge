import DiscordButton from "../private/buttons/DiscordButton.js";
import DiscordButtonData from "../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../types/discord.js";

class JoinRequestViewBlacklist extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("joinRequestViewBlacklist");
  override readonly flags = [CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const username = this.getUsernameFromJoinRequest(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError("Unable to find username");
    const blacklistUser = await this.discord.application.data.blacklist.getUserByUsername(username);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("User is not blacklisted");
    await interaction.followUp(await this.discord.application.data.blacklist.getBlacklistDataResponse(blacklistUser));
  }
}

export default JoinRequestViewBlacklist;
