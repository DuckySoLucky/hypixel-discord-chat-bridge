import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import { type ButtonInteraction, LabelBuilder, ModalBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";

class GexpCheckGenerateKickButton extends DiscordButton {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordButtonData("gexpCheckGenerateKick");
    this.response = ButtonResponse.None;
    this.flags = [CommandFlags.StaffOnly, CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction) {
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
