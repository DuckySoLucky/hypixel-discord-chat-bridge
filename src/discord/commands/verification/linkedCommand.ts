import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, type ChatInputCommandInteraction, Message } from "discord.js";
import { BasicInteractionResponse, CommandFlags, type DiscordManagerWithClient } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/Embed.js";
import type LinkedUser from "../../../data/linked/LinkedUser.js";

class LinkedCommand extends DiscordCommand {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("linked")
      .setDescription("View who a user is linked to")
      .addUserOption((option) => option.setName("user").setDescription("Discord Username"))
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username"));
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

    let buttons: ButtonBuilder[];
    if (guildMember) {
      buttons = [
        new ButtonBuilder().setCustomId("kickUser").setLabel("Kick").setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(guildMember.mutedUntil ? "unmuteUser" : "muteUser")
          .setLabel(guildMember.mutedUntil ? "Unmute" : "Mute")
          .setStyle(guildMember.mutedUntil ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("demoteUser").setLabel("Demote").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("promoteUser").setLabel("Promote").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("setRankUser").setLabel("Set Rank").setStyle(ButtonStyle.Success)
      ];
    } else {
      buttons = [new ButtonBuilder().setCustomId("inviteUser").setLabel("Invite").setStyle(ButtonStyle.Success)];
    }

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(`\`${nickname}\` (\`${uuid}\`) is linked to <@${linked.discordId}>.`)
          .setFields(
            { name: "Discord ID", value: `\`\`\`${linked.discordId}\`\`\`` },
            { name: "Formatted Username", value: `\`\`\`${formattedNickname}\`\`\`` },
            { name: "Username", value: `\`\`\`${nickname}\`\`\`` },
            { name: "UUID", value: `\`\`\`${uuid}\`\`\`` },
            { name: "Is in Guild", value: guildMember ? ":white_check_mark: Yes" : ":x: No" }
          )
          .setDevFooter("Kathund")
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("unverifyUser").setLabel("Force Unverify User").setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId("updateUser").setLabel("Force Update User").setStyle(ButtonStyle.Success)
        )
      ]
    });
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    const username = interaction.options.getString("username");
    if (!user && !username) throw new HypixelDiscordChatBridgeError("You must specify a user or username.");
    if (user && username) throw new HypixelDiscordChatBridgeError("You cannot specify both user and username.");
    const linkedUser = username
      ? await this.discord.application.data.linked.getUserByUsername(username)
      : await this.discord.application.data.linked.getUserByDiscordId(user!.id);
    if (!linkedUser) throw new HypixelDiscordChatBridgeError("User is not verified");
    await this.followUp(interaction, linkedUser);
  }
}

export default LinkedCommand;
