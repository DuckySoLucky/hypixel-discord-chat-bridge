import Command from "../Private/Commands/Command.js";
import CommandData from "../Private/Commands/CommandData.js";
import Embed from "../Private/Embed.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import MowojangAPI from "../../Private/MowojangAPI.js";
import { TitleCaseCamel } from "../../Utils/StringUtils.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { DiscordManagerWithClient, Requirement, Requirements } from "../../Types/Discord.js";

class RequirementsCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData()
      .setName("requirements")
      .setDescription("Check a user's requirements to join the guild")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username"));
  }

  async checkRequirements(uuid: string): Promise<Requirements> {
    const stats = await this.discord.app.linked.getPlayerVariableStats(uuid);
    const { requirements: configRequirements, requiredToHave } = this.discord.app.config.minecraft.guildRequirements;

    const requirements: Requirement[] = Object.entries(configRequirements).map(([key, required]) => {
      const has = stats[key] ?? 0;
      return { key, required, has, passed: (has as number) >= required };
    });

    const requirementsPassed = requirements.filter((requirement) => requirement.passed).length;
    const passed = requirementsPassed >= requiredToHave;

    return { username: stats.username as string, uuid, guildName: stats.guildName as string, passed, requirementsPassed, requirements };
  }

  generateEmbed({ passed, username, guildName, requirements, requirementsPassed }: Requirements): Embed {
    return new Embed()
      .setColor(passed ? 2067276 : 15548997)
      .setTitle(`${username} **${passed ? "has" : "hasn't"}** got the requirements to join ${guildName}!`)
      .setDescription(
        `${username} meets **${requirementsPassed} requirement(s)** out of the required **${
          this.discord.app.config.minecraft.guildRequirements.requiredToHave
        } requirement(s)** needed to join ${guildName}`
      )
      .addFields(
        requirements.map(({ key, has, required, passed }) => ({
          name: TitleCaseCamel(key),
          value: `${passed ? ":white_check_mark:" : ":x:"} ${has}/${required}`,
          inline: true
        }))
      )
      .setThumbnail(`https://www.mc-heads.net/avatar/${username}`);
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString("username");
    if (username === null) throw new HypixelDiscordChatBridgeError("Please input a username");
    const uuid = await MowojangAPI.getUUID(username);
    if (uuid === null) throw new HypixelDiscordChatBridgeError("Player does not exist");
    const data = await this.checkRequirements(uuid);
    const embed = this.generateEmbed(data);
    await interaction.followUp({ embeds: [embed] });
  }
}

export default RequirementsCommand;
