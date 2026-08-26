import DiscordCommand from "../../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../../private/commands/DiscordCommandDataBuilder.js";
import HypixelDiscordChatBridgeError from "../../../../private/error.js";
import MowojangAPI from "../../../../private/MowojangAPI.js";
import { ActionRowBuilder, type BaseMessageOptions, ButtonBuilder, ButtonComponent, ButtonStyle, ComponentType, Message } from "discord.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission } from "../../../../types/discord.js";
import { type GexpCheckOptions, type GexpCheckOptionsDisplays, type ParsedGexpCheckUser, gexpCheckData } from "../../../../types/inactivity.js";
import { SuccessEmbed } from "../../../private/EmbedHelper.js";
import { removeDashesFromUUID } from "hypixel-api-reborn";
import { sanitizeString } from "../../../../utils/stringUtils.js";

class GexpCheckCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("gexp-check")
    .setDescription("Shows everyone under an set amount of gexp")
    .addNumberOption((option) => option.setName("requirement").setDescription("Members below this GEXP number").setRequired(true).setMinValue(1));
  override readonly flags = [CommandFlags.InactivityCommand, CommandFlags.VerificationCommand];
  override readonly permission = CommandPermission.Staff;

  async getUsers(data: GexpCheckOptions): Promise<{ users: ParsedGexpCheckUser[]; filtered: ParsedGexpCheckUser[]; data: GexpCheckOptions }> {
    const { requirement, hiddenRanks, bot, verified, unverified, inactive, blacklisted, withRequirement, withoutRequirement } = data;
    const users: ParsedGexpCheckUser[] = [];
    const members = await this.discord.application.getBotGuild().then((guild) => guild.members.sort((a, b) => b.weeklyExperience - a.weeklyExperience));
    for (const member of members) {
      const username = await MowojangAPI.getUsername(member.uuid);
      if (username === null) continue;
      const verified = await this.discord.application.data.linked.getUserByUUID(member.uuid);
      const inactive = verified ? await this.discord.application.data.inactivity.getUserByDiscordId(verified.discordId) : undefined;
      const blacklist = await this.discord.application.data.blacklist.getUserByUUID(member.uuid);
      users.push({ username, uuid: member.uuid, member, verified, inactive, hasRequirement: member.weeklyExperience >= requirement, blacklist });
    }

    if (!this.discord.application.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.discord.application.messages.minecraftBotOffline);
    if (!this.discord.application.minecraft.bot.session) throw new HypixelDiscordChatBridgeError(this.discord.application.messages.minecraftBotOffline);
    const uuid = removeDashesFromUUID(this.discord.application.minecraft.bot.session.selectedProfile.id);

    let filtered: ParsedGexpCheckUser[];
    filtered = users;
    if (bot) filtered = filtered.filter((user) => removeDashesFromUUID(user.uuid) !== uuid);
    if (verified) filtered = filtered.filter((user) => user.verified !== undefined);
    if (unverified) filtered = filtered.filter((user) => user.verified === undefined);
    if (inactive) filtered = filtered.filter((user) => user.inactive !== undefined);
    if (blacklisted) filtered = filtered.filter((user) => user.blacklist !== undefined);
    if (withRequirement) filtered = filtered.filter((user) => user.hasRequirement);
    if (withoutRequirement) filtered = filtered.filter((user) => !user.hasRequirement);
    filtered = filtered.filter((user) => !hiddenRanks.includes(user.member.rank));

    return { users, filtered, data };
  }

  static getOptionsfromMessage(message: Message): GexpCheckOptions | undefined {
    const data: GexpCheckOptions = {
      requirement: 0,
      hiddenRanks: ["Guild Master"],
      bot: true,
      verified: false,
      unverified: false,
      inactive: false,
      blacklisted: false,
      withRequirement: true,
      withoutRequirement: false
    };

    if (message.author.id !== message.client.user.id) return;
    const embed = message.embeds[0];
    if (!embed) return;
    const author = embed.author?.name;
    if (!author) return;
    const [, requirementRaw = "0"] = author.split(" - ");
    const requirement = Number(requirementRaw);
    if (Number.isNaN(requirement)) return;
    data.requirement = requirement;
    const component = message.components[0];
    if (!component || component.type !== ComponentType.ActionRow) return;
    component.components
      .filter((component): component is ButtonComponent => component.type === ComponentType.Button)
      .filter((component) => component.customId !== null && component.customId.startsWith("gexpcheck_"))
      .forEach((compontent) => {
        data[(compontent.customId ?? "").replaceAll("gexpcheck_", "") as keyof GexpCheckOptionsDisplays] = compontent.style === ButtonStyle.Success;
      });
    const hiddenRanksField = embed.fields?.find((field) => field.name === "Hidden Ranks");
    if (!hiddenRanksField) return;
    data.hiddenRanks = hiddenRanksField.value === "None" ? [] : hiddenRanksField.value.split(",").map((s) => s.trim());
    return data;
  }

  async getResponse(rawData: GexpCheckOptions): Promise<BaseMessageOptions> {
    const { users, filtered, data } = await this.getUsers(rawData);
    const { requirement, hiddenRanks } = data;

    const filterButtons = Object.entries(gexpCheckData).map(([id, { label }]) =>
      new ButtonBuilder()
        .setLabel(label)
        .setCustomId(id)
        .setStyle((data[id.replaceAll("gexpcheck_", "") as keyof typeof data] ?? false) ? ButtonStyle.Success : ButtonStyle.Danger)
    );

    return {
      embeds: [
        new SuccessEmbed()
          .setAuthor({ name: `Showing ${filtered.length}/${users.length} (${((filtered.length / users.length) * 100).toFixed(2)}%) users - ${requirement}` })
          .setDescription(this.parseUsers(filtered).join("\n"))
          .addFields({ name: "Hidden Ranks", value: hiddenRanks.length > 0 ? hiddenRanks.join(", ") : "None" })
          .setDevFooter("Kathund")
      ],
      components: [
        ...Array.from({ length: Math.ceil(filterButtons.length / 5) }, (_, i) =>
          new ActionRowBuilder<ButtonBuilder>().addComponents(filterButtons.slice(i * 5, i * 5 + 5))
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setLabel("More Filters").setCustomId("gexpCheckFilters").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setLabel("Generate Kick Commands").setCustomId("gexpCheckGenerateKick").setStyle(ButtonStyle.Danger)
        )
      ]
    };
  }

  parseUsers(data: ParsedGexpCheckUser[]): string[] {
    if (data.length === 0) return ["No user's found"];
    return data.sort((a, b) => b.member.weeklyExperience - a.member.weeklyExperience).map((user) => this.parseUser(user));
  }

  parseUser({ username, member }: ParsedGexpCheckUser): string {
    return `${sanitizeString(username)} - ${member.weeklyExperience.toLocaleString()}`;
  }

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const requirement = interaction.options.getNumber("requirement", true);
    const response = await this.getResponse({
      requirement,
      hiddenRanks: ["Guild Master"],
      bot: true,
      verified: false,
      unverified: false,
      inactive: false,
      blacklisted: false,
      withRequirement: true,
      withoutRequirement: false
    });
    await interaction.followUp(response);
  }
}

export default GexpCheckCommand;
