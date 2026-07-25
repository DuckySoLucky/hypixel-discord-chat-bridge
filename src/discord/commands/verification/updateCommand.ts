import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import MowojangAPI from "../../../private/MowojangAPI.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import type { ButtonInteraction, ChatInputCommandInteraction } from "discord.js";

class UpdateCommand extends DiscordCommand<DiscordManagerWithBot> {
  discordId: string | null = null;
  isSelf: boolean = false;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("update").setDescription("Update your current roles");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction) {
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
