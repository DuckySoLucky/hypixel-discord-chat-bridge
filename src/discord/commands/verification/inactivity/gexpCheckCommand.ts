import Button from "../../../private/buttons/Button.js";
import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../../private/commands/DiscordCommandData.js";
import MowojangAPI from "../../../../private/MowojangAPI.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonComponent, ButtonStyle, type ChatInputCommandInteraction, ComponentType, Message } from "discord.js";
import { CommandFlags, type DiscordManagerWithClient } from "../../../../types/discord.js";
import { type GexpCheckOptions, type GexpDisplay, GexpDisplays, type ParsedGexpCheckUser } from "../../../../types/inactivity.js";
import { SuccessEmbed } from "../../../private/Embed.js";
import { sanitizeString } from "../../../../utils/stringUtils.js";
import { translate } from "../../../../translations/TranslationsManager.js";

class GexpCheckCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData().setName("gexp-check").addNumberOption((option) => option.setName("requirement").setRequired(true).setMinValue(1));
    this.flags = [CommandFlags.StaffOnly, CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  }

  async getUsers({ requirement, type, hiddenRanks }: GexpCheckOptions): Promise<{ users: ParsedGexpCheckUser[]; filtered: ParsedGexpCheckUser[] }> {
    const users: ParsedGexpCheckUser[] = [];
    const members = await this.discord.application.getBotGuild().then((guild) => guild.members.sort((a, b) => b.weeklyExperience - a.weeklyExperience));
    for (const member of members) {
      const username = await MowojangAPI.getUsername(member.uuid);
      if (username === null) continue;
      const verified = await this.discord.application.data.linked.getUserByUUID(member.uuid);
      const inactive = verified ? await this.discord.application.data.inactivity.getUserByDiscordId(verified.discordId) : undefined;
      users.push({ username, member, verified, inactive, hasRequirement: member.weeklyExperience >= requirement });
    }

    let filtered: ParsedGexpCheckUser[];
    if (type === "gexpCheckAll") filtered = users;
    else if (type === "gexpCheckInactive") filtered = users.filter((user) => user.inactive !== undefined);
    else if (type === "gexpCheckUnverified") filtered = users.filter((user) => user.verified === undefined);
    else if (type === "gexpCheckMembersWithRequirements") filtered = users.filter((user) => user.hasRequirement);
    else if (type === "gexpCheckMembersWithoutRequirements") filtered = users.filter((user) => !user.hasRequirement);
    else filtered = users;

    filtered = filtered.filter((user) => !hiddenRanks.includes(user.member.rank));

    return { users, filtered };
  }

  static getOptionsfromMessage(message: Message): GexpCheckOptions | undefined {
    if (message.author.id !== message.client.user.id) return;
    const embed = message.embeds[0];
    if (!embed) return;
    const author = embed.author?.name;
    if (!author) return;
    const [, requirementRaw = "0"] = author.split(" - ");
    const requirement = Number(requirementRaw);
    if (Number.isNaN(requirement)) return;
    const component = message.components[0];
    if (!component || component.type !== ComponentType.ActionRow) return;
    const primaryButton = component.components
      .filter((component): component is ButtonComponent => component.type === ComponentType.Button)
      .find((button) => button.style === ButtonStyle.Primary);
    const type: GexpDisplay = (primaryButton?.customId as GexpDisplay) ?? "gexpCheckAll";
    const field = embed.fields?.find((field) => field.name === translate("discord.commands.gexp-check.execute.success.embed.fields.ranks"));
    if (!field) return;
    const hiddenRanks = field.value === "None" ? [] : field.value.split(",").map((s) => s.trim());
    return { requirement, type, hiddenRanks };
  }

  async getResponse({ requirement, type, hiddenRanks }: GexpCheckOptions): Promise<BaseMessageOptions> {
    const { users, filtered } = await this.getUsers({ requirement, type, hiddenRanks });

    return {
      embeds: [
        new SuccessEmbed()
          .setAuthor({
            name: translate("discord.commands.gexp-check.execute.success.embed.author", {
              filteredUsers: filtered.length,
              users: users.length,
              percentage: ((filtered.length / users.length) * 100).toFixed(2),
              requirement
            })
          })
          .setTitle(translate(`discord.commands.gexp-check.execute.success.embed.title.${type}`, { requirement }))
          .setDescription(this.parseUsers(filtered).join("\n"))
          .addFields({
            name: translate("discord.commands.gexp-check.execute.success.embed.fields.ranks"),
            value: hiddenRanks.length > 0 ? hiddenRanks.join(", ") : translate("none")
          })
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<Button>().addComponents(
          GexpDisplays.map((id) => new Button().setCustomId(id).setStyle(id === type ? ButtonStyle.Primary : ButtonStyle.Secondary))
        ),
        new ActionRowBuilder<Button>().addComponents(
          new Button().setCustomId("gexpCheckFilters").setStyle(ButtonStyle.Primary),
          new Button().setCustomId("gexpCheckGenerateKick").setStyle(ButtonStyle.Danger)
        )
      ]
    };
  }

  parseUsers(data: ParsedGexpCheckUser[]): string[] {
    if (data.length === 0) return [translate("discord.commands.gexp-check.execute.errors.failed.find.users")];
    return data.sort((a, b) => b.member.weeklyExperience - a.member.weeklyExperience).map((user) => this.parseUser(user));
  }

  parseUser({ username, member }: ParsedGexpCheckUser): string {
    return `${sanitizeString(username)} - ${member.weeklyExperience.toLocaleString()}`;
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const requirement = interaction.options.getNumber("requirement", true);
    const response = await this.getResponse({ requirement, type: "gexpCheckAll", hiddenRanks: [] });
    await interaction.followUp(response);
  }
}

export default GexpCheckCommand;
