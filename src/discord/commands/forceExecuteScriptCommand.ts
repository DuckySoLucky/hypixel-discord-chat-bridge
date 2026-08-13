import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed, { SuccessEmbed } from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type AutocompleteInteractionWithGuild, type AutocompleteOption, type ChatInputCommandInteractionWithGuild, CommandPermission } from "../../types/discord.js";
import { titleCaseCamel } from "../../utils/stringUtils.ts";

class ForceExecuteScriptCommand extends DiscordCommand {
  override readonly data = new DiscordCommandData()
    .setName("force-execute-script")
    .setDescription("Allows executing scripts")
    .addStringOption((option) => option.setName("script-name").setDescription("Script Name").setRequired(true).setAutocomplete(true));
  override readonly permission = CommandPermission.StaffOnly;

  override async autocomplete(interaction: AutocompleteInteractionWithGuild): Promise<void> {
    const options: AutocompleteOption[] = this.discord.application.scripts.scripts
      .map(({ id }) => ({ value: id, name: titleCaseCamel(id) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    await this.respondToAutocomplete(interaction, options);
  }

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const scriptName = interaction.options.getString("script-name", true);
    const script = this.discord.application.scripts.getScript(scriptName);
    if (!script) throw new HypixelDiscordChatBridgeError("Could not find that script?");
    await interaction.followUp({ embeds: [new Embed().setDescription(`Executing \`${script.id}\` script`).setDevFooter("Kathund")] });
    await script.runNow();
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Finished executing \`${script.id}\` script`).setDevFooter("Kathund")] });
  }
}

export default ForceExecuteScriptCommand;
