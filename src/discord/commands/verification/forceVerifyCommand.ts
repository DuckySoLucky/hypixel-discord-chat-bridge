import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import VerifyCommand from "./verifyCommand.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";

class ForceVerifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("force-verify")
    .setDescription("Connect Discord account to a Minecraft")
    .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true))
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const user = interaction.options.getUser("user", true);
    const verifyCommand = new VerifyCommand(this.discord);
    verifyCommand.isSelf = false;
    verifyCommand.discordId = user.id;
    await verifyCommand.execute(interaction);
  }
}

export default ForceVerifyCommand;
