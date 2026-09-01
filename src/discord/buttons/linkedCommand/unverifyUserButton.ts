import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import UnverifyCommand from "../../commands/verification/unverifyCommand.js";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";

class UnverifyUserButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("unverifyUser");
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.discordId = linked.discordId;
    await unverifyCommand.execute(interaction);
  }
}

export default UnverifyUserButton;
