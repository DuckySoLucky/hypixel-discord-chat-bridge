import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import VerifyCommand from "./verifyCommand.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ForceVerifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("force-verify")
      .setDescription("Connect Discord account to a Minecraft")
      .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true))
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user", true);
    const verifyCommand = new VerifyCommand(this.discord);
    verifyCommand.isSelf = false;
    verifyCommand.discordId = user.id;
    await verifyCommand.execute(interaction);
  }
}

export default ForceVerifyCommand;
