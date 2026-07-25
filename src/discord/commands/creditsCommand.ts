import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import { CommonDevs, MiscCredits } from "../../private/constants.js";
import { DevTypes } from "../../types/misc.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient } from "../../types/discord.js";

class CreditsCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("credits").setDescription("Shows the credits of the people who make this possible");
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const miscCredits = MiscCredits.map(({ name, description, link }) => `- **[${name}](<https://${link}>):** ${description}`).join("\n");
    const embed = new Embed()
      .setTitle("**Credits**")
      .addFields(
        DevTypes.map((type) => {
          return {
            name: `**${type}**`,
            value: Object.values(CommonDevs)
              .filter((data) => data.type === type)
              .sort((a, b) => a.username.localeCompare(b.username))
              .map(({ username, github, id }) => `@${username} (<@${id}>) - [Github](<https://github.com/${github ?? username}>)`)
              .join("\n")
          };
        })
      )
      .addFields({ name: "**Misc**", value: `Below are some tools/projects that this bot utilizes to stay a float\n${miscCredits}` })
      .addFields({
        name: "**Support**",
        value: `If you need any support please reach out to the maintainers: ${Object.values(CommonDevs)
          .filter(({ type }) => type === "Maintainer")
          .map(({ username }) => `@${username}`)
          .join(", ")}`
      });

    await interaction.followUp({ embeds: [embed] });
  }
}

export default CreditsCommand;
