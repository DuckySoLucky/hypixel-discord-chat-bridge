import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";

class KickUserButton extends DiscordButton {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordButtonData("kickUser");
    this.response = ButtonResponse.None;
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId("kickUser")
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

export default KickUserButton;
