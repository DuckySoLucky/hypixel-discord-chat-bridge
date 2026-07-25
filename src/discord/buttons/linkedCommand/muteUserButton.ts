import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";

class MuteUserButton extends DiscordButton {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordButtonData("muteUser");
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
        .setCustomId("muteUser")
        .setTitle(`Mute ${username}`)
        .addLabelComponents(
          new LabelBuilder()
            .setLabel(`Length of ${username}'s mute`)
            .setTextInputComponent(new TextInputBuilder().setCustomId("muteUserTime").setStyle(TextInputStyle.Short).setPlaceholder(`Length of ${username}'s mute`))
        )
    );
  }
}

export default MuteUserButton;
