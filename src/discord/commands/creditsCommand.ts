import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { CommonDevs, MiscCredits } from "../../private/constants.js";
import { DevTypes, MiscCreditIds } from "../../types/misc.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../types/discord.js";

class CreditsCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("credits");
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const miscCredits = MiscCreditIds.map((id) =>
      translate("discord.commands.credits.execute.success.embed.fields.misc.value.format", {
        name: translate(`credits.${id}.name`),
        link: MiscCredits[id],
        description: translate(`credits.${id}.description`)
      })
    );
    const embed = new Embed().setTitle(translate("discord.commands.credits.execute.success.embed.title")).addFields(
      ...DevTypes.map((type) => {
        return {
          name: `**${translate(type)}**`,
          value: Object.values(CommonDevs)
            .filter((data) => data.type === type)
            .sort((a, b) => a.username.localeCompare(b.username))
            .map(({ username, github, id, lang }) =>
              translate("discord.commands.credits.execute.success.embed.fields.type.value", {
                username,
                id,
                github: github ?? username,
                flag: lang ? `- :flag_${lang}:` : ""
              }).trim()
            )
            .join("\n")
        };
      }),
      {
        name: translate("discord.commands.credits.execute.success.embed.fields.misc.title"),
        value: translate("discord.commands.credits.execute.success.embed.fields.misc.value.message", { message: miscCredits.join("\n") })
      },
      {
        name: translate("discord.commands.credits.execute.success.embed.fields.support.title"),
        value: translate("discord.commands.credits.execute.success.embed.fields.support.value", {
          maintainers: Object.values(CommonDevs)
            .filter(({ type }) => type === "maintainer")
            .map(({ username }) => `@${username}`)
            .join(", ")
        })
      }
    );

    await interaction.followUp({ embeds: [embed] });
  }
}

export default CreditsCommand;
