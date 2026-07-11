import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import Embed, { SuccessEmbed } from "../../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedUser from "../../../data/linked/LinkedUser.js";
import UpdateCommand from "./updateCommand.js";
import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import { delay } from "../../../utils/miscUtils.js";
import { getPlayer } from "../../../utils/hypixelUtils.js";
import { translate } from "../../../translations/TranslationsManager.js";

class VerifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  discordId: string | null = null;
  isSelf: boolean = false;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("verify").addStringOption((option) => option.setName("username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (this.discordId === null) {
        this.isSelf = true;
        this.discordId = interaction.user.id;
      }

      if (!interaction.guild || !interaction.member) throw new HypixelDiscordChatBridgeError(translate("discord.errors.interaction.not.in.guild"));
      const discordUser = await interaction.guild.members.fetch(this.discordId).catch((e) => console.error(e));
      if (!discordUser) throw new HypixelDiscordChatBridgeError(translate("discord.commands.verify.execute.errors.no.discord.discord"));

      const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(this.discordId);
      if (linkedUser !== undefined) throw new HypixelDiscordChatBridgeError(translate("discord.commands.verify.execute.errors.verified"));

      const username = interaction.options.getString("username", true);
      const { socialMedia, nickname, uuid } = await getPlayer(username);

      if (this.isSelf) {
        const discordUsername = socialMedia.discord;
        if (!discordUsername) {
          throw new HypixelDiscordChatBridgeError(
            translate("discord.commands.verify.execute.errors.no.discord.found", {
              nickname,
              instructions: translate("discord.commands.verify.execute.errors.no.discord.instructions.message")
            })
          );
        }

        if (discordUsername.toLowerCase() !== discordUser.user.username) {
          throw new HypixelDiscordChatBridgeError(
            translate("discord.commands.verify.execute.errors.no.discord.match", {
              nickname,
              discordUsername,
              instructions: translate("discord.commands.verify.execute.errors.no.discord.instructions.message")
            })
          );
        }
      }

      await new LinkedUser({ discordId: this.discordId, uuid }, this.discord.application.data.linked).save();

      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(
              translate("discord.commands.verify.execute.success.embed.description.message", {
                format: translate(`discord.commands.verify.execute.success.embed.description.format.self.${this.isSelf}`, { discordId: this.discordId }),
                nickname
              })
            )
            .setAuthor({ name: translate("discord.commands.verify.execute.success.embed.author") })
            .setDevFooter("Kathund")
        ]
      });

      const updateCommand = new UpdateCommand(this.discord);
      updateCommand.isSelf = this.isSelf;
      updateCommand.discordId = this.discordId;
      await updateCommand.execute(interaction);
    } catch (error) {
      if (!(error instanceof Error)) return;
      this.discord.handleError(error, interaction);
      if (!error.message.includes(translate("discord.commands.verify.execute.errors.no.discord.instructions.message"))) return;
      await delay(500);
      const steps = [
        translate("discord.commands.verify.execute.errors.no.discord.instructions.steps.step1"),
        translate("discord.commands.verify.execute.errors.no.discord.instructions.steps.step2"),
        translate("discord.commands.verify.execute.errors.no.discord.instructions.steps.step3"),
        translate("discord.commands.verify.execute.errors.no.discord.instructions.steps.step4"),
        translate("discord.commands.verify.execute.errors.no.discord.instructions.steps.step5", { username: interaction.user.username }),
        translate("discord.commands.verify.execute.errors.no.discord.instructions.steps.step6")
      ];
      const instructions = steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n");
      await interaction.followUp({
        embeds: [
          new Embed()
            .setAuthor({ name: translate("discord.commands.verify.execute.errors.no.discord.instructions.embed.author") })
            .setFields([{ name: translate("discord.commands.verify.execute.errors.no.discord.instructions.embed.fields"), value: instructions }])
            .setImage("https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif")
            .setDevFooter("Kathund")
        ],
        flags: MessageFlags.Ephemeral
      });
    }

    this.discordId = null;
    this.isSelf = false;
  }
}

export default VerifyCommand;
