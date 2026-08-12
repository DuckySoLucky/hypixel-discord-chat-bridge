import DiscordButton from "../private/buttons/DiscordButton.js";
import DiscordButtonData from "../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import LinkedCommand from "../commands/verification/linkedCommand.js";
import { CommandPermission } from "../../types/discord.js";
import type { ButtonInteraction } from "discord.js";

class GetLinkedButton extends DiscordButton {
  override readonly data = new DiscordButtonData("getLinked");
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ButtonInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    await linkedCommand.followUp(interaction, linked);
  }
}

export default GetLinkedButton;
