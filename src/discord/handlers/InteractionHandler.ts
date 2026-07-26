import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type BaseInteraction, type ButtonInteraction, type ChatInputCommandInteraction, GuildMember, type ModalSubmitInteraction } from "discord.js";
import { CommandFlags } from "../../types/discord.js";
import { isAdminMember, isGuildMember, isStaffMember, isVerifiedMember } from "../../utils/discordUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type BasicInteractionData from "../private/BasicInteractionData.js";
import type DiscordManager from "../DiscordManager.js";
import type { ParseKeys } from "i18next";

class InteractionHandler {
  constructor(private readonly discord: DiscordManager) {}

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.discord.commandHandler.onCommand(interaction);
    if (interaction.isAutocomplete()) this.discord.commandHandler.onAutoComplete(interaction);
    if (interaction.isButton()) this.discord.buttonHandler.onButton(interaction);
    if (interaction.isModalSubmit()) this.discord.modalHandler.onSubmit(interaction);
  }

  async checkPerms(interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction, data: BasicInteractionData) {
    if (!interaction.guild || !interaction.member) throw new HypixelDiscordChatBridgeError(translate("discord.errors.interaction.not.in.guild"));
    const member = interaction.member instanceof GuildMember ? interaction.member : await interaction.guild.members.fetch(interaction.user.id);

    const [isGuildMemberCheck, isStaffMemberCheck, isAdminMemberCheck, isVerifiedMemberCheck] = await Promise.all([
      isGuildMember(member),
      isStaffMember(member),
      isAdminMember(member),
      isVerifiedMember(member)
    ]);

    const checks: Array<[boolean, ParseKeys, Record<string, ParseKeys>]> = [
      [data.flags.includes(CommandFlags.GuildMemberOnly) && !isGuildMemberCheck, "discord.errors.interaction.no.permissions", {}],
      [data.flags.includes(CommandFlags.StaffOnly) && !isStaffMemberCheck, "discord.errors.interaction.no.permissions", {}],
      [data.flags.includes(CommandFlags.AdminOnly) && !isAdminMemberCheck, "discord.errors.interaction.no.permissions", {}],
      [data.flags.includes(CommandFlags.VerifiedOnly) && !isVerifiedMemberCheck, "discord.errors.interaction.command.no.verify", {}],
      [
        data.flags.includes(CommandFlags.InactivityCommand) && !this.discord.application.config.verification.inactivity.enabled,
        "discord.errors.interaction.command.disabled",
        { type: "inactivity.name" }
      ],
      [
        data.flags.includes(CommandFlags.VerificationCommand) && !this.discord.application.config.verification.enabled,
        "discord.errors.interaction.command.disabled",
        { type: "linked.name" }
      ],
      [
        data.flags.includes(CommandFlags.BlacklistCommand) && !this.discord.application.config.blacklist.enabled,
        "discord.errors.interaction.command.disabled",
        { type: "blacklist.name" }
      ],
      [data.flags.includes(CommandFlags.RequiresMinecraftBot) && !this.discord.application.minecraft.isBotOnline(), "minecraft.errors.offline", {}]
    ];

    for (const [failed, message, translations] of checks) {
      const replaces: Record<string, string> = {};
      Object.entries(translations).forEach(([key, value]) => {
        replaces[key] = translate(value);
      });

      // TODO: Come back to this and fix the eslint rule

      if (failed) throw new HypixelDiscordChatBridgeError(translate(message, replaces));
    }
  }
}

export default InteractionHandler;
