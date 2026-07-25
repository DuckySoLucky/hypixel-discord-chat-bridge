import DiscordCommand from "../private/commands/DiscordCommand.js";
import DiscordCommandData from "../private/commands/DiscordCommandData.js";
import Embed from "../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { formatNumber, titleCaseCamel } from "../../utils/stringUtils.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient, Requirement, Requirements } from "../../types/discord.js";
import type { PlayerVariableStatsKeysNumber } from "../../private/constants.js";

class RequirementsCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("requirements")
      .setDescription("Check a user's requirements to join the guild")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username"));
  }

  async checkRequirements(uuid: string): Promise<Requirements> {
    const stats = await this.discord.application.data.linked.getPlayerVariableStats(uuid);
    const { requirements: configRequirements, requirementsNeededToPass } = this.discord.application.config.minecraft.guild.requirements;

    const requirements: Requirement[] = Object.entries(configRequirements).map(([key, required]) => {
      const has = stats[key as PlayerVariableStatsKeysNumber] ?? 0;
      return { key, required, has, passed: has >= required };
    });

    const requirementsPassed = requirements.filter((requirement) => requirement.passed).length;
    const passed = requirementsPassed >= requirementsNeededToPass;

    return { username: stats.username, uuid, guildName: stats.guildName, passed, requirementsPassed, requirements };
  }

  generateEmbed({ passed, username, guildName, requirements, requirementsPassed }: Requirements): Embed {
    return new Embed()
      .setColor(passed ? "Green" : "Red")
      .setTitle(`${username} **${passed ? "has" : "hasn't"}** got the requirements to join ${guildName}!`)
      .setDescription(
        `${username} meets **${requirementsPassed} requirement(s)** out of the required **${
          this.discord.application.config.minecraft.guild.requirements.requirementsNeededToPass
        } requirement(s)** needed to join ${guildName}`
      )
      .addFields(
        requirements.map(({ key, has, required, passed }) => ({
          name: titleCaseCamel(key),
          value: `${passed ? ":white_check_mark:" : ":x:"} ${formatNumber(has, 2)}/${required}`,
          inline: true
        }))
      )
      .setThumbnail(`https://www.mc-heads.net/avatar/${username}`);
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("username", true);
    const uuid = await MowojangAPI.getUUID(username);
    if (uuid === null) throw new HypixelDiscordChatBridgeError("Player does not exist");
    const data = await this.checkRequirements(uuid);
    const embed = this.generateEmbed(data);
    await interaction.followUp({ embeds: [embed] });
  }
}

export default RequirementsCommand;
