import DiscordButton from "../private/buttons/DiscordButton.js";
import DiscordButtonData from "../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { ActionRowBuilder, ButtonBuilder, ComponentType } from "discord.js";
import { type ButtonInteractionWithGuild, CommandFlags, CommandPermission, type DiscordManagerWithBot } from "../../types/discord.js";
import { SuccessEmbed } from "../private/EmbedHelper.js";

class JoinRequestAcceptButton extends DiscordButton<DiscordManagerWithBot> {
  override readonly data = new DiscordButtonData("joinRequestAccept");
  override readonly flags = [CommandFlags.RequiresMinecraftBot];
  override readonly permission = CommandPermission.StaffOnly;

  override async execute(interaction: ButtonInteractionWithGuild) {
    const username = this.getUsernameFromJoinRequest(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError("Unable to find username");
    this.discord.application.minecraft.bot.chat(`/g accept ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully accepted \`${username}\` into the guild.`)] });

    const component = interaction.message.components[0];
    if (!component || component.type !== ComponentType.ActionRow) return;
    let found = false;
    const fixedButtons = component.components.flatMap((compontent) => {
      if (compontent.type !== ComponentType.Button) return [];
      if (compontent.customId === "joinRequestAccept") found = true;
      return [
        new ButtonBuilder()
          .setCustomId(compontent.customId!)
          .setLabel(compontent.label!)
          .setStyle(compontent.style)
          .setDisabled(compontent.customId === "joinRequestAccept")
      ];
    });
    if (!found) return;
    await interaction.message.edit({ components: [new ActionRowBuilder<ButtonBuilder>().addComponents(fixedButtons)] });
  }
}

export default JoinRequestAcceptButton;
