import BlacklistCommand from "../../commands/blacklistCommand.js";
import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";

class UnblacklistButton extends DiscordButton {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordButtonData("unblacklist");
    this.response = ButtonResponse.None;
    this.flags = [CommandFlags.StaffOnly, CommandFlags.BlacklistCommand];
  }

  override async execute(interaction: ButtonInteraction) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    const blacklistUser = await blacklistCommand.getBlacklistedFromLinkedEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId("unblacklist")
        .setTitle("Reason")
        .addLabelComponents(
          new LabelBuilder()
            .setLabel("Reason for removing from the blacklist")
            .setTextInputComponent(
              new TextInputBuilder().setCustomId("unblacklistReason").setStyle(TextInputStyle.Paragraph).setPlaceholder("No reason provided").setRequired(false)
            )
        )
    );
  }
}

export default UnblacklistButton;
