import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import UnverifyCommand from "./unverifyCommand.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ForceUnverifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("force-unverify")
      .setDescription("Remove a linked Minecraft account")
      .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user", true);
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.isSelf = false;
    unverifyCommand.discordId = user.id;
    await unverifyCommand.execute(interaction);
  }
}

export default ForceUnverifyCommand;
