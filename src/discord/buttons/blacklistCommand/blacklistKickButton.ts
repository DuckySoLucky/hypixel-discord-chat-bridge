import BlacklistCommand from "../../commands/blacklistCommand.js";
import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.js";
import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

class BlacklistKickButton extends DiscordButton {
  override readonly data = new DiscordButtonData("blacklistKick");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.BlacklistCommand, CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const blacklistCommand = new BlacklistCommand(this.discord);
    const blacklistUser = await blacklistCommand.getBlacklistedFromBlacklistEmbed(interaction.message);
    if (!blacklistUser) throw new HypixelDiscordChatBridgeError("Unable to find the blacklist user");
    const username = await blacklistUser.getUsername();
    if (!username) throw new HypixelDiscordChatBridgeError("Could not find a username for this blacklisted user?");

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId("blacklistKick")
        .setTitle(`Kick ${username}`)
        .addLabelComponents(
          new LabelBuilder()
            .setLabel(`Reason for kicking ${username}`)
            .setTextInputComponent(
              new TextInputBuilder().setCustomId("kickUserReason").setStyle(TextInputStyle.Short).setPlaceholder(`Reason for kicking ${username}`).setRequired(true)
            )
        )
    );
  }
}

export default BlacklistKickButton;
