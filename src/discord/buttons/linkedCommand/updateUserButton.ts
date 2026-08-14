import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import UpdateCommand from "../../commands/verification/updateCommand.js";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";

class UpdateUserButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("updateUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.isSelf = false;
    updateCommand.discordId = linked.discordId;
    await updateCommand.execute(interaction);
  }
}

export default UpdateUserButton;
