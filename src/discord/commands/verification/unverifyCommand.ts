import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import {
  type ButtonInteractionWithGuild,
  type ChatInputCommandInteractionWithGuild,
  CommandFlags,
  CommandPermission,
  type DiscordManagerWithBot
} from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";

class UnverifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder().setName("unverify").setDescription("Remove your linked Minecraft account");
  override readonly flags = [CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Linked;
  discordId: string | null = null;

  override async execute(interaction: ChatInputCommandInteractionWithGuild | ButtonInteractionWithGuild) {
    if (!this.discordId) this.discordId = interaction.user.id;
    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(this.discordId);
    if (linkedUser === undefined) throw new HypixelDiscordChatBridgeError(`<@${this.discordId}> is not verified`);
    await linkedUser.reset();
    await linkedUser.delete();
    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription(`Successfully unlinked <@${this.discordId}> from \`${await linkedUser.getUsername()}\`!`).setDevFooter("Kathund")]
    });
    this.discordId = null;
  }
}

export default UnverifyCommand;
