import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import UnverifyCommand from "./unverifyCommand.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";

class ForceUnverifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("force-unverify")
    .setDescription("Remove a linked Minecraft account")
    .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const user = interaction.options.getUser("user", true);
    const unverifyCommand = new UnverifyCommand(this.discord);
    unverifyCommand.isSelf = false;
    unverifyCommand.discordId = user.id;
    await unverifyCommand.execute(interaction);
  }
}

export default ForceUnverifyCommand;
