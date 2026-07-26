import Button from "../../private/buttons/Button.js";
import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { ActionRowBuilder, ButtonInteraction, ButtonStyle, type ChatInputCommandInteraction, Message } from "discord.js";
import { BasicInteractionResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type LinkedUser from "../../../data/linked/LinkedUser.js";

class LinkedCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("linked")
      .addUserOption((option) => option.setName("user"))
      .addStringOption((option) => option.setName("username"));
    this.flags = [CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
    this.response = BasicInteractionResponse.Ephemeral;
  }

  async getLinkedFromLinkedEmbed(message: Message): Promise<LinkedUser | undefined> {
    if (message.author.id !== message.client.user.id) return undefined;
    const embed = message.embeds[0];
    if (embed === undefined) return undefined;
    const field = embed.fields.find((field) => field.name === "Discord ID");
    if (field === undefined) return undefined;
    return await this.discord.application.data.linked.getUserByDiscordId(field.value.replaceAll("`", ""));
  }

  async followUp(interaction: ChatInputCommandInteraction | ButtonInteraction, linked: LinkedUser) {
    const [{ uuid, nickname, formattedNickname }, guildMember] = await Promise.all([linked.getHypixelPlayer(), linked.isUserInHypixelGuild()]);

    let buttons: Button[];
    if (guildMember) {
      buttons = [
        new Button().setCustomId("kickUser").setStyle(ButtonStyle.Danger),
        new Button().setCustomId(guildMember.mutedUntil ? "unmuteUser" : "muteUser").setStyle(guildMember.mutedUntil ? ButtonStyle.Success : ButtonStyle.Danger),
        new Button().setCustomId("demoteUser").setStyle(ButtonStyle.Danger),
        new Button().setCustomId("promoteUser").setStyle(ButtonStyle.Success),
        new Button().setCustomId("setRankUser").setStyle(ButtonStyle.Success)
      ];
    } else {
      buttons = [new Button().setCustomId("inviteUser").setStyle(ButtonStyle.Success)];
    }

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(translate("discord.commands.linked.execute.success", { nickname, uuid, discordId: linked.discordId }))
          .setFields(
            { name: translate("discord.name"), value: translate("discord.format.mention", { id: linked.discordId }) },
            { name: translate("discord.embed.generic.fields.discord.id.name"), value: translate("discord.embed.generic.fields.data.value", { data: linked.discordId }) },
            { name: translate("discord.embed.generic.fields.username.name"), value: translate("discord.embed.generic.fields.data.value", { data: nickname }) },
            {
              name: translate("discord.embed.generic.fields.username.formatted.name"),
              value: translate("discord.embed.generic.fields.data.value", { data: formattedNickname })
            },
            { name: translate("discord.embed.generic.fields.uuid.name"), value: translate("discord.embed.generic.fields.data.value", { data: uuid }) },
            { name: translate("discord.embed.generic.fields.inGuild.name"), value: translate(`discord.embed.generic.fields.inGuild.value.${guildMember !== undefined}`) }
          )
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<Button>().addComponents(buttons),
        new ActionRowBuilder<Button>().addComponents(
          new Button().setCustomId("unverifyUser").setStyle(ButtonStyle.Danger),
          new Button().setCustomId("updateuser").setStyle(ButtonStyle.Success)
        )
      ]
    });
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    const username = interaction.options.getString("username");
    if (!user && !username) throw new HypixelDiscordChatBridgeError(translate("generic.errors.arguments.two.missing", { argumentOne: "user", argumentTwo: "username" }));
    if (user && username) throw new HypixelDiscordChatBridgeError(translate("generic.errors.arguments.two.supply", { argumentOne: "user", argumentTwo: "username" }));
    const linkedUser = username
      ? await this.discord.application.data.linked.getUserByUsername(username)
      : await this.discord.application.data.linked.getUserByDiscordId(user!.id);
    if (!linkedUser) throw new HypixelDiscordChatBridgeError(translate("linked.errors.user.missing"));
    await this.followUp(interaction, linkedUser);
  }
}

export default LinkedCommand;
