import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import { AttachmentBuilder } from "discord.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";
import { messageToImage } from "../../../utils/minecraftUtils.js";

class RenderTextCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("render-text")
    .setDescription("Render Text using the bots minecraft text rendering")
    .addStringOption((option) => option.setName("text").setDescription("the text").setRequired(true))
    .addStringOption((option) => option.setName("username").setDescription("The username to parse in. This required if you want to use {skin}"));
  override readonly flags = [CommandFlags.DebugCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const message = interaction.options.getString("text", true);
    const username = interaction.options.getString("username");
    await interaction.followUp({ files: [new AttachmentBuilder(await messageToImage(message, username), { name: "render.png" })] });
  }
}

export default RenderTextCommand;
