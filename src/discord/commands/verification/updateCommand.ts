import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import MowojangAPI from "../../../private/MowojangAPI.js";
import {
  type ButtonInteractionWithGuild,
  type ChatInputCommandInteractionWithGuild,
  CommandFlags,
  CommandPermission,
  type DiscordManagerWithBot
} from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";

class UpdateCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder().setName("update").setDescription("Update your current roles");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Linked;
  discordId: string | null = null;

  override async execute(interaction: ChatInputCommandInteractionWithGuild | ButtonInteractionWithGuild) {
    if (!this.discordId) this.discordId = interaction.user.id;
    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(this.discordId);
    if (linkedUser === undefined) throw new HypixelDiscordChatBridgeError(`<@${this.discordId}> is not verified`);
    const response = await linkedUser.updateRoles();
    if (response === null) throw new HypixelDiscordChatBridgeError("Something wen't wrong with updating");
    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(`Successfully synced <@${this.discordId}>'s roles with \`${await MowojangAPI.getUsername(linkedUser.uuid)}\`'s stats!`)
          .setDevFooter("Kathund")
      ]
    });
    this.discordId = null;
  }
}

export default UpdateCommand;
