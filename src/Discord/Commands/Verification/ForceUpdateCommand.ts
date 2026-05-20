import Command from "../../Private/Commands/Command.js";
import CommandData from "../../Private/Commands/CommandData.js";
import HypixelDiscordChatBridgeError from "../../../Private/Error.js";
import UpdateCommand from "./UpdateCommand.js";
import { CommandFlags, CommandResponse, CommandType, type DiscordManagerWithBot } from "../../../Types/Discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ForceUpdateCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("force-update")
      .setDescription("Update user's or everyone's roles")
      .addUserOption((option) => option.setName("user").setDescription("Discord Username"))
      .addBooleanOption((option) => option.setName("everyone").setDescription("Update everyone's roles"));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
    this.response = CommandResponse.Ephemeral;
    this.type = CommandType.Staff;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.isSelf = false;

    const user = interaction.options.getUser("user");
    const everyone = interaction.options.getBoolean("everyone");
    if (!user && !everyone) throw new HypixelDiscordChatBridgeError("You must specify a user or everyone.");
    if (user && everyone) throw new HypixelDiscordChatBridgeError("You cannot specify both user and everyone.");

    if (user) {
      updateCommand.discordId = user.id;
      await updateCommand.execute(interaction);
    } else if (everyone) {
      for (const [, discordId] of Object.entries(this.discord.app.linked.getLinkedFile())) {
        updateCommand.discordId = discordId;
        await updateCommand.execute(interaction);
        console.log(`Updated roles for ${discordId}`);
      }
    }
  }
}

export default ForceUpdateCommand;
