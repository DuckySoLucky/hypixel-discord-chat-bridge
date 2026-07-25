import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteraction, LabelBuilder, ModalBuilder, RadioGroupBuilder } from "discord.js";
import { ButtonResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";
import { RadioGroupOptionBuilder } from "discord.js";
import type LinkedUser from "../../../data/linked/LinkedUser.js";

class SetRankUserButton extends DiscordButton {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordButtonData("setRankUser");
    this.response = ButtonResponse.None;
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ButtonInteraction) {
    const linkedCommand = new LinkedCommand(this.discord);
    const linked = await linkedCommand.getLinkedFromLinkedEmbed(interaction.message);
    if (!linked) throw new HypixelDiscordChatBridgeError("Unable to find the linked user");
    const username = await linked.getUsername();
    const modal = new ModalBuilder()
      .setCustomId("setRankUser")
      .setTitle(`Set Rank ${username}`)
      .addLabelComponents(await this.createRankLabel(linked));
    await interaction.showModal(modal);
  }

  private async createRankLabel(linked: LinkedUser): Promise<LabelBuilder> {
    const guild = this.discord.application.botGuild ? this.discord.application.botGuild : await this.discord.application.getBotGuild();
    const guildMember = await linked.isUserInHypixelGuild();

    return new LabelBuilder().setLabel("Rank").setRadioGroupComponent(
      new RadioGroupBuilder()
        .setCustomId("setRankUserRank")
        .setRequired(true)
        .addOptions(
          guild.ranks.map(({ name }) =>
            new RadioGroupOptionBuilder()
              .setLabel(name)
              .setValue(name)
              .setDefault(guildMember?.rank === name)
          )
        )
    );
  }
}

export default SetRankUserButton;
