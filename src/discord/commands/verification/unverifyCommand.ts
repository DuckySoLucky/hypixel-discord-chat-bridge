import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import {
  type ButtonInteractionWithGuild,
  type ChatInputCommandInteractionWithGuild,
  CommandFlags,
  CommandPermission,
  type DiscordManagerWithBot
} from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";

class UnverifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandData().setName("unverify").setDescription("Remove your linked Minecraft account");
  override readonly flags = [CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.VerifiedOnly;
  discordId: string | null = null;
  isSelf: boolean = false;

  override async execute(interaction: ChatInputCommandInteractionWithGuild | ButtonInteractionWithGuild) {
    if (this.discordId === null) {
      this.isSelf = true;
      this.discordId = interaction.user.id;
    }
    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(this.discordId);
    if (linkedUser === undefined) throw new HypixelDiscordChatBridgeError("User is not verified");
    await linkedUser.reset();
    await linkedUser.delete();
    await interaction.followUp({
      embeds: [new SuccessEmbed().setDescription(`${this.isSelf ? "Your" : `<@${this.discordId}>'s`} account has been successfully unlinked`).setDevFooter("Kathund")]
    });

    this.discordId = null;
    this.isSelf = false;
  }
}

export default UnverifyCommand;
