import Command from "../../Private/Commands/Command.js";
import CommandData from "../../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../../Private/Error.js";
import VerifyCommand from "./VerifyCommand.js";
import { CommandFlags, CommandResponse, CommandType, type DiscordManagerWithBot } from "../../../Types/Discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ForceVerify extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("force-verify")
      .setDescription("Connect Discord account to a Minecraft")
      .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true))
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
    this.response = CommandResponse.Ephemeral;
    this.type = CommandType.Staff;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser("user");
    if (!user) throw new HypixelDiscordChatBridgeError("The \`user\` option is missing?");
    const verifyCommand = new VerifyCommand(this.discord);
    verifyCommand.isSelf = false;
    verifyCommand.discordId = user.id;
    await verifyCommand.execute(interaction);
  }
}

export default ForceVerify;
