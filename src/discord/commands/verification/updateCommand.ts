import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import MowojangAPI from "../../../private/MowojangAPI.js";
import {
  type ButtonInteractionWithGuild,
  type ChatInputCommandInteractionWithGuild,
  CommandFlags,
  CommandPermission,
  type DiscordManagerWithBot
} from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";

class UpdateCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandData().setName("update").setDescription("Update your current roles");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
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

    const response = await linkedUser.updateRoles();
    if (response === null) throw new HypixelDiscordChatBridgeError("Something wen't wrong with updating");

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(
            `Successfully synced ${this.isSelf ? "your" : `<@${this.discordId}>`} roles with \`${await MowojangAPI.getUsername(linkedUser.uuid)}\`'s stats!`
          )
          .setDevFooter("Kathund")
      ]
    });

    this.discordId = null;
    this.isSelf = false;
  }
}

export default UpdateCommand;
