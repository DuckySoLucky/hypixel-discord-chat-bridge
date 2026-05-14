import Command from "../../Private/Commands/Command.js";
import CommandData from "../../Private/Commands/CommandData.js";
import MowojangAPI from "../../../Private/MowojangAPI.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../Types/Discord.js";
import { ErrorEmbed, SuccessEmbed } from "../../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class UpdateCommand extends Command<DiscordManagerWithBot> {
  discordId: string | null;
  isSelf: boolean;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName("update").setDescription("Update your current roles");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
    this.discordId = null;
    this.isSelf = false;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (this.discordId === null) {
      this.isSelf = true;
      this.discordId = interaction.user.id;
    }

    const linkedUser = this.discord.app.linked.getUserByDiscordId(this.discordId);
    if (linkedUser === undefined) {
      await interaction.followUp({ embeds: [new ErrorEmbed().setDescription("User is not verified").setDevFooter("Kathund")] });
      return;
    }

    const response = await linkedUser.updateRoles();
    if (response === null) {
      await interaction.followUp({ embeds: [new ErrorEmbed().setDescription("Something wen't wrong with updating").setDevFooter("Kathund")] });
      return;
    }

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(
            `Successfully synced ${this.isSelf ? "your" : `<@${this.discordId}>`} roles with \`${await MowojangAPI.getUsername(linkedUser.uuid)}\`'s stats!`
          )
          .setDevFooter("Kathund")
      ]
    });
  }
}

export default UpdateCommand;
