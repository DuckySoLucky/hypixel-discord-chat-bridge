import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import MowojangAPI from "../../../private/MowojangAPI.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type { ButtonInteraction, ChatInputCommandInteraction } from "discord.js";

class UpdateCommand extends DiscordCommand<DiscordManagerWithBot> {
  discordId: string | null = null;
  isSelf: boolean = false;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("update");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction | ButtonInteraction) {
    if (this.discordId === null) {
      this.isSelf = true;
      this.discordId = interaction.user.id;
    }

    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(this.discordId);
    if (linkedUser === undefined) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.missing"));

    const response = await linkedUser.updateRoles();
    if (response === null) throw new HypixelDiscordChatBridgeError(translate("discord.commands.update.execute.errors.failed.update"));

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(
            translate("discord.commands.update.execute.success.message", {
              format: translate(`discord.commands.update.execute.success.format.self.${this.isSelf}`, { discordId: this.discordId }),
              username: await MowojangAPI.getUsername(linkedUser.uuid)
            })
          )
          .setDevFooter("Kathund")
      ]
    });

    this.discordId = null;
    this.isSelf = false;
  }
}

export default UpdateCommand;
