import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { AttachmentBuilder } from "discord.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../../types/discord.js";
import { type ConfigMinecraftFontRenderer } from "../../../types/config.js";

class RenderTextCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("render-text")
    .setDescription("Render Text using the bots minecraft text rendering")
    .addStringOption((option) => option.setName("text").setDescription("the text to render").setRequired(true))
    .addStringOption((option) => option.setName("username").setDescription("The username to parse in. This required if you want to use {skin}"))
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("The font rendering target")
        .addChoices([
          { name: "Modern", value: "modern" },
          { name: "Legecy", value: "legecy" }
        ])
    );
  override readonly flags = [CommandFlags.DebugCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const message = interaction.options.getString("text", true);
    const username = interaction.options.getString("username");
    const renderTarget = interaction.options.getString("target") ?? this.discord.application.config.minecraft.fontRenderer.target;
    if (!["modern", "legecy"].includes(renderTarget)) throw new HypixelDiscordChatBridgeError("Unsupported render type. Please use either modern or legecy");
    await interaction.followUp({
      files: [
        new AttachmentBuilder(await this.discord.application.minecraft.renderer.renderText(message, username, renderTarget as ConfigMinecraftFontRenderer["target"]), {
          name: "render.png"
        })
      ]
    });
  }
}

export default RenderTextCommand;
