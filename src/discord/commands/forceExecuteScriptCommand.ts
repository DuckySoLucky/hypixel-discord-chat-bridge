import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../private/commands/DiscordCommandDataBuilder.js";
import EmbedHelper, { SuccessEmbed } from "../private/EmbedHelper.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import prettyMilliseconds from "pretty-ms";
import { type AutocompleteInteractionWithGuild, type AutocompleteOption, type ChatInputCommandInteractionWithGuild, CommandPermission } from "../../types/discord.js";
import { titleCaseCamel } from "../../utils/stringUtils.js";

class ForceExecuteScriptCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("force-execute-script")
    .setDescription("Allows executing scripts")
    .addStringOption((option) => option.setName("script-name").setDescription("Script Name").setRequired(true).setAutocomplete(true));
  override readonly permission = CommandPermission.Staff;

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
    await interaction.followUp({ embeds: [new EmbedHelper().setDescription(`Executing \`${script.id}\` script`).setDevFooter("Kathund")] });
    const duration = await script.setUser(interaction.user).runNow();
    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(`Finished executing \`${script.id}\` script`)
          .addFields({ name: "Duration", value: `${duration.toFixed(2)}ms (${prettyMilliseconds(duration)})` })
          .setDevFooter("Kathund")
      ]
    });
  }
}

export default ForceExecuteScriptCommand;
