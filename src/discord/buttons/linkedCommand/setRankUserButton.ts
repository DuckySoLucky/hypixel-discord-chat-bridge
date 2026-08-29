import DiscordButton from "../../private/buttons/DiscordButton.js";
import DiscordButtonData from "../../private/buttons/DiscordButtonData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedCommand from "../../commands/verification/linkedCommand.js";
import { type ButtonInteractionWithGuild, ButtonResponse, CommandFlags, CommandPermission } from "../../../types/discord.js";
import { LabelBuilder, ModalBuilder, RadioGroupBuilder, RadioGroupOptionBuilder } from "discord.js";
import type LinkedUser from "../../../data/linked/LinkedUser.js";

class SetRankUserButton extends DiscordButton {
  override readonly data = new DiscordButtonData("setRankUser");
  override readonly response = ButtonResponse.None;
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  override async execute(interaction: ButtonInteractionWithGuild) {
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
