import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../private/commands/DiscordCommandDataBuilder.js";
import EmbedHelper from "../private/EmbedHelper.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { CommonDevs, MiscCredits } from "../../private/constants.js";
import { type DevData, type DevName, DevTypes } from "../../types/application.js";
import { convertDevDataToName } from "../../utils/miscUtils.js";
import type { ChatInputCommandInteractionWithGuild } from "../../types/discord.js";

class CreditsCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("credits")
    .setDescription("Shows the credits of the people who make this possible")
    .addStringOption((option) =>
      option
        .setName("developer")
        .setDescription("View information for a developer")
        .setChoices(
          Object.entries(CommonDevs)
            .sort(([, a], [, b]) => a.displayName.localeCompare(b.displayName))
            .map(([key, dev]) => ({ name: `${convertDevDataToName(dev)} - ${dev.type}`, value: key }))
        )
    )
    .setAuthors(["Kathund"]);

  static getDevSelectMenu(): StringSelectMenuBuilder {
    return new StringSelectMenuBuilder()
      .setCustomId("creditsDevSelector")
      .setPlaceholder("View information for a developer")
      .setOptions(
        new StringSelectMenuOptionBuilder().setLabel("Overview").setValue("overview"),
        ...Object.entries(CommonDevs)
          .sort(([, a], [, b]) => a.displayName.localeCompare(b.displayName))
          .map(([key, dev]) => new StringSelectMenuOptionBuilder().setLabel(`${convertDevDataToName(dev)} - ${dev.type}`).setValue(key))
      );
  }

  getDevOverviewResponse(): BaseMessageOptions {
    const miscCredits = MiscCredits.map(({ name, description, link }) => `- **[${name}](<https://${link}>):** ${description}`).join("\n");
    const embed = new EmbedHelper()
      .setTitle("**Credits**")
      .addFields(
        ...DevTypes.map((type) => ({
          name: type,
          value: Object.values(CommonDevs)
            .filter((dev) => dev.type === type)
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((dev) => `${convertDevDataToName(dev, true)} - [Github](<https://github.com/${dev.githubUsername}>)`)
            .join("\n")
        }))
      )
      .addFields({ name: "**Misc**", value: `Below are some tools/projects that this bot utilizes to stay afloat\n${miscCredits}` })
      .addFields({
        name: "**Support**",
        value: `If you need any support please reach out to the maintainers: ${Object.values(CommonDevs)
          .filter(({ type }) => type === "Maintainer")
          .map((dev) => convertDevDataToName(dev))
          .join(", ")}`
      })
      .setDevFooter("Kathund");
    return { embeds: [embed], components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(CreditsCommand.getDevSelectMenu())] };
  }

  getDevInfoResponse(devName: DevName | "overview"): BaseMessageOptions {
    if (devName === "overview") return this.getDevOverviewResponse();
    const devData = CommonDevs[devName] as DevData;
    const buttons: ButtonBuilder[] = [new ButtonBuilder().setLabel("Github").setStyle(ButtonStyle.Link).setURL(`https://github.com/${devData.githubUsername}`)];
    const lines: string[] = [`**Role:** ${devData.type}`];
    if (devData.discord) {
      lines.push(`**Discord:** <@${devData.discord.id}> (@${devData.discord.username} | \`${devData.discord.id}\`)`);
      buttons.push(new ButtonBuilder().setLabel("Discord").setStyle(ButtonStyle.Link).setURL(`https://discord.com/users/${devData.discord.id}`));
    }
    const discordCommands = this.discord.commandHandler.commands.filter(({ data }) => data.authors.includes(devName)).map((command) => `- \`${command.data.name}\``);
    const minecraftCommands = this.discord.application.minecraft.commandHandler.commands
      .filter(({ data }) => data.authors.includes(devName))
      .map((command) => `- \`${command.data.name}\``);
    return {
      embeds: [
        new EmbedHelper()
          .setTitle(`Showing information for ${devData.displayName}`)
          .setDescription(lines.join("\n"))
          .addFields(
            { name: "Discord Commands", value: discordCommands.length === 0 ? "None" : discordCommands.join("\n"), inline: true },
            { name: "Minecraft Commands", value: minecraftCommands.length === 0 ? "None" : minecraftCommands.join("\n"), inline: true }
          )
          .setThumbnail(devData.avatarURL ?? null)
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(CreditsCommand.getDevSelectMenu())
      ]
    };
  }

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const devName = interaction.options.getString("developer") as DevName | undefined;
    if (devName) {
      const dev = CommonDevs[devName] as DevData | undefined;
      if (!dev) throw new HypixelDiscordChatBridgeError(`Could not find dev data for ${devName}`);
      await interaction.followUp(this.getDevInfoResponse(devName));
      return;
    }

    await interaction.followUp(this.getDevOverviewResponse());
  }
}

export default CreditsCommand;
