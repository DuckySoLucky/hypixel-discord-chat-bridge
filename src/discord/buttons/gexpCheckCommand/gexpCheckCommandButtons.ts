import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import GexpCheckCommand from "../../commands/verification/inactivity/gexpCheckCommand.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.js";
import { type GexpDisplay, GexpDisplays } from "../../../types/inactivity.js";
import type { ButtonInteraction } from "discord.js";

class GexpCheckCommandButtons extends DiscordButton {
  override readonly data = new DiscordButtonData([...GexpDisplays]);
  override readonly response = ButtonResponse.Update;
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ButtonInteraction) {
    const gexpCheckCommand = new GexpCheckCommand(this.discord);
    const options = GexpCheckCommand.getOptionsfromMessage(interaction.message);
    if (!options) throw new HypixelDiscordChatBridgeError("Unable to find the requirement gexp");
    options.type = interaction.customId as GexpDisplay;
    const response = await gexpCheckCommand.getResponse(options);
    await interaction.editReply(response);
  }
}

export default GexpCheckCommandButtons;
