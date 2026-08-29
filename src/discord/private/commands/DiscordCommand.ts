import BasicInteractionData from "../BasicInteractionData.js";
import {
  type AutocompleteInteractionWithGuild,
  type AutocompleteOption,
  BasicInteractionResponse,
  type ChatInputCommandInteractionWithGuild,
  type DiscordManagerWithClient
} from "../../../types/discord.js";
import { ParseAutoComplete } from "../../../utils/discordUtils.js";
import type DiscordCommandDataBuilder from "./DiscordCommandDataBuilder.js";
import type DiscordManager from "../../DiscordManager.js";

abstract class DiscordCommand<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  abstract readonly data: DiscordCommandDataBuilder;
  readonly response: BasicInteractionResponse = BasicInteractionResponse.Public;

  async autocomplete(interaction: AutocompleteInteractionWithGuild) {
    await this.respondToAutocomplete(interaction, []);
  }

  protected async respondToAutocomplete(interaction: AutocompleteInteractionWithGuild, options: AutocompleteOption[]) {
    const focusedOption = interaction.options.getFocused(true);

    // eslint-disable-next-line default-case -- Should just use the options that already exist
    switch (focusedOption.name) {
      case "guild-member-username": {
        const members = this.discord.application.botGuildMembers;
        if (members === undefined) {
          options = [{ name: "No username's cached" }];
          break;
        }
        options = members.sort((a, b) => a.username.localeCompare(b.username)).map(({ username }) => ({ name: username }));
        break;
      }
      case "guild-rank": {
        const ranks = this.discord.application.botGuild?.ranks;
        if (ranks === undefined) {
          options = [{ name: "No guild's cached" }];
          break;
        }
        options = ranks.sort((a, b) => a.name.localeCompare(b.name)).map(({ name }) => ({ name }));
        break;
      }
    }

    await interaction.respond(ParseAutoComplete(interaction, options));
  }

  abstract execute(interaction: ChatInputCommandInteractionWithGuild): Promise<void>;
}

export default DiscordCommand;
