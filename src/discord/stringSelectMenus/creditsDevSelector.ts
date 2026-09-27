import CreditsCommand from "../commands/creditsCommand.js";
import DiscordStringSelectMenu from "../private/stringSelectMenu/DiscordStringSelectMenu.js";
import DiscordStringSelectMenuData from "../private/stringSelectMenu/DiscordStringSelectMenuData.js";
import { ButtonResponse, type StringSelectMenuInteractionWithGuild } from "../../types/discord.js";
import type { DevName } from "../../types/application.js";

class CreditsDevSelector extends DiscordStringSelectMenu {
  override readonly data = new DiscordStringSelectMenuData("creditsDevSelector");
  override response: ButtonResponse = ButtonResponse.Update;

  override async execute(interaction: StringSelectMenuInteractionWithGuild) {
    const creditsCommand = new CreditsCommand(this.discord);
    await interaction.editReply(creditsCommand.getDevInfoResponse(interaction.values[0] as DevName));
  }
}

export default CreditsDevSelector;
