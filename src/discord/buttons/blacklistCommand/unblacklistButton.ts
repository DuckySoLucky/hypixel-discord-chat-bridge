import BlacklistCommand from "../../commands/blacklistCommand.js";
import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.js";
import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

class UnblacklistButton extends DiscordButton {
  override readonly data = new DiscordButtonData("unblacklist");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.BlacklistCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    const blacklistUser = await blacklistCommand.getBlacklistedFromBlacklistEmbed(interaction.message);
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
