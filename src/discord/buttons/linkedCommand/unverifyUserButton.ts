import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import UnverifyCommand from "../../commands/verification/unverifyCommand.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import type { ButtonInteraction } from "discord.js";

class UnverifyUserButton extends DiscordButton<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordButtonData("unverifyUser");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.isSelf = false;
    unverifyCommand.discordId = linked.discordId;
    await unverifyCommand.execute(interaction);
  }
}

export default UnverifyUserButton;
