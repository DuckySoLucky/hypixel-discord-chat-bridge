import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.js";
import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

class MuteUserButton extends DiscordButton {
  override readonly data = new DiscordButtonData("muteUser");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ButtonInteractionWithGuild) {
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
