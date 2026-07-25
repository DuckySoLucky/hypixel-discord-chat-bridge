import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed, { SuccessEmbed } from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class ForceExecuteScriptCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("force-execute-script")
      .setDescription("Allows executing scripts")
      .addStringOption((option) => option.setName("script-name").setDescription("Script Name").setRequired(true).setAutocomplete(true));
    this.flags = [CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const scriptName = interaction.options.getString("script-name", true);
    const script = this.discord.application.scripts.scripts.get(scriptName);
    if (!script) throw new HypixelDiscordChatBridgeError("Could not find that script?");
    await interaction.followUp({ embeds: [new Embed().setDescription(`Executing \`${script.id}\` script`).setDevFooter("Kathund")] });
    await script.execute();
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Finished executing \`${script.id}\` script`).setDevFooter("Kathund")] });
  }
}

export default ForceExecuteScriptCommand;
