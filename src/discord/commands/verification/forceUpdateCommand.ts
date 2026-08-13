import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import UpdateCommand from "./updateCommand.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";

class ForceUpdateCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandData()
    .setName("force-update")
    .setDescription("Update user's roles")
    .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const user = interaction.options.getUser("user", true);
    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.isSelf = false;
    updateCommand.discordId = user.id;
    await updateCommand.execute(interaction);
  }
}

export default ForceUpdateCommand;
