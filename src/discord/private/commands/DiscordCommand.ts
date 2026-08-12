import BasicInteractionData from "../BasicInteractionData.js";
import { type AutoComplateOption, BasicInteractionResponse, type DiscordManagerWithClient } from "../../../types/discord.js";
import { ParseAutoComplete } from "../../../utils/discordUtils.js";
import { titleCaseCamel, truncateString } from "../../../utils/stringUtils.js";
import type DiscordCommandData from "./DiscordCommandData.js";
import type DiscordManager from "../../DiscordManager.js";
import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

abstract class DiscordCommand<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  abstract readonly data: DiscordCommandData;
  readonly response: BasicInteractionResponse = BasicInteractionResponse.Public;

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices: AutoComplateOption[];
    switch (focusedOption.name) {
      case "guild-member-username": {
        const members = this.discord.application.botGuildMembers;
        if (members === undefined) {
          choices = [{ name: "No username's cached" }];
          break;
        }
        choices = members.sort((a, b) => a.username.localeCompare(b.username)).map(({ username }) => ({ name: username }));
        break;
      }
      case "guild-rank": {
        const ranks = this.discord.application.botGuild?.ranks;
        if (ranks === undefined) {
          choices = [{ name: "No guild's cached" }];
          break;
        }
        choices = ranks.sort((a, b) => a.name.localeCompare(b.name)).map(({ name }) => ({ name }));
        break;
      }
      case "script-name": {
        choices = this.discord.application.scripts.scripts.map(({ id }) => ({ value: id, name: titleCaseCamel(id) })).sort((a, b) => a.name.localeCompare(b.name));
        break;
      }
      case "inactivity": {
        const users = await this.discord.application.data.inactivity.getFullData().then((users) => users.filter((user) => !user.isExpired));
        const parsed = (
          await Promise.all(
            users.map(async (user) => {
              const discUser = await user.getDiscordUser();
              if (!discUser) return null;
              return { username: this.discord.messageHandler.getDisplayName(discUser), reason: user.reason, id: user.inactivityId };
            })
          )
        ).filter((x): x is { username: string; reason: string; id: string } => x !== null);
        choices = parsed
          .sort((a, b) => a.username.localeCompare(b.username))
          .map(({ username, reason, id }) => ({ value: id, name: `${username} - ${truncateString(reason, 20)}` }));
        break;
      }
      default: {
        choices = [{ name: "Something went wrong" }];
        break;
      }
    }

    await interaction.respond(ParseAutoComplete(interaction, choices));
  }

  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export default DiscordCommand;
