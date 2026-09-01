import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import LinkedUser from "../../../data/linked/LinkedUser.js";
import MowojangAPI from "../../../private/MowojangAPI.js";
import UpdateCommand from "./updateCommand.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";
import { HypixelDiscordChatBridgeError } from "../../../plugin-api.ts";

class ForceVerifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("force-verify")
    .setDescription("Connect Discord account to a Minecraft")
    .addUserOption((option) => option.setName("user").setDescription("Discord Username").setRequired(true))
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const user = interaction.options.getUser("user", true);
    const profile = await MowojangAPI.getProfile(interaction.options.getString("username", true));
    if (profile.error || !profile.data) throw new HypixelDiscordChatBridgeError("Player does not exist");

    const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(interaction.user.id);
    if (linkedUser !== undefined) {
      throw new HypixelDiscordChatBridgeError(`<@${user.id}> is already verified to ${profile.data.username}. Please use /linked to handle this`);
    }

    const linkedMinecraftUser = await this.discord.application.data.linked.getUserByUUID(profile.data.UUID);
    if (linkedMinecraftUser !== undefined) {
      throw new HypixelDiscordChatBridgeError(`${profile.data.username} is already verified to <@${linkedMinecraftUser.discordId}>. Please use /linked to handle this`);
    }

    await new LinkedUser({ discordId: interaction.user.id, uuid: profile.data.UUID }, this.discord.application.data.linked).save();

    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.discordId = user.id;
    await updateCommand.execute(interaction);
  }
}

export default ForceVerifyCommand;
