import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.js";
import { LabelBuilder, ModalBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

class GexpCheckGenerateKickButton extends DiscordButton {
  override readonly data = new DiscordButtonData("gexpCheckGenerateKick");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId("gexpCheckGenerateKick")
        .setTitle("Reason for kicking")
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              "## Variables",
              "List of optional variables that can be inputed into the reason",
              "",
              "- `{gexp}` - Current gexp that the user has",
              "- `{requirement}` - Current gexp requirement that has been set",
              "- `{username}` The username"
            ].join("\n")
          )
        )
        .addLabelComponents(
          new LabelBuilder()
            .setLabel("Reason for kicking")
            .setTextInputComponent(
              new TextInputBuilder().setCustomId("gexpCheckGenerateKickReason").setStyle(TextInputStyle.Short).setPlaceholder("Reason for the kick").setRequired(true)
            )
        )
    );
  }
}

export default GexpCheckGenerateKickButton;
