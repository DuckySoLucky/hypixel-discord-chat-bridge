import BlacklistCommand from "../../commands/blacklistCommand.js";
import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ButtonInteraction } from "discord.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { translate } from "../../../translations/TranslationsManager.js";

class BlacklistRefreshButton extends DiscordButton {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordButtonData("blacklistRefresh");
    this.flags = [CommandFlags.StaffOnly, CommandFlags.BlacklistCommand];
  }

  override async execute(interaction: ButtonInteraction) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    const blacklistUser = await blacklistCommand.getBlacklistedFromLinkedEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError(translate("blacklist.errors.failed.find"));
    await interaction.message.edit(await this.discord.application.data.blacklist.getBlacklistDataResponse(blacklistUser));
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(translate("discord.buttons.blacklistRefresh.execute.success")).setDevFooter("Kathund")] });
  }
}

export default BlacklistRefreshButton;
