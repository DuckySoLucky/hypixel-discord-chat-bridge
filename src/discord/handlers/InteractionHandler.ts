import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type BaseInteraction, type ButtonInteraction, type ChatInputCommandInteraction, type ModalSubmitInteraction } from "discord.js";
import { CommandFlags, CommandPermission } from "../../types/discord.js";
import { isAdminMember, isGuildMember, isStaffMember, isVerifiedMember } from "../../utils/discordUtils.js";
import type BasicInteractionData from "../private/BasicInteractionData.js";
import type DiscordManager from "../DiscordManager.js";

class InteractionHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onInteraction(interaction: BaseInteraction): Promise<void> {
    if (interaction.isChatInputCommand()) await this.discord.commandHandler.onCommand(interaction);
    else if (interaction.isAutocomplete()) await this.discord.commandHandler.onAutoComplete(interaction);
    else if (interaction.isButton()) await this.discord.buttonHandler.onButton(interaction);
    else if (interaction.isModalSubmit()) await this.discord.modalHandler.onSubmit(interaction);
  }

  async checkPerms(interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction, data: BasicInteractionData<DiscordManager>) {
    if (!interaction.guild || !interaction.member) throw new HypixelDiscordChatBridgeError("Please run this command inside of a guild");
    const member = await interaction.guild.members.fetch(interaction.user.id);

    const [isGuildMemberCheck, isStaffMemberCheck, isAdminMemberCheck, isVerifiedMemberCheck] = await Promise.all([
      isGuildMember(member),
      isStaffMember(member),
      isAdminMember(member),
      isVerifiedMember(member)
    ]);

    const checks: Array<[boolean, string]> = [
      [
        data.permission === CommandPermission.AdminOnly && !isAdminMemberCheck,
        "You don't have permission to use this command. You are required to be an admin to use this command."
      ],
      [
        data.permission === CommandPermission.StaffOnly && !isStaffMemberCheck,
        "You don't have permission to use this command. You are required to be an staff member to use this command."
      ],
      [
        data.permission === CommandPermission.GuildMemberOnly && !isGuildMemberCheck,
        "You don't have permission to use this command. You are required to be inside of the guild to use this command."
      ],
      [data.permission === CommandPermission.VerifiedOnly && !isVerifiedMemberCheck, "This command requires you to be verified. Please use /verify to verify."],
      [data.flags.includes(CommandFlags.InactivityCommand) && !this.discord.application.config.verification.inactivity.enabled, "Inactivity commands are disabled."],
      [data.flags.includes(CommandFlags.VerificationCommand) && !this.discord.application.config.verification.enabled, "Verification commands are disabled."],
      [data.flags.includes(CommandFlags.BlacklistCommand) && !this.discord.application.config.blacklist.enabled, "Blacklist commands are disabled."],
      [data.flags.includes(CommandFlags.RequiresMinecraftBot) && !this.discord.application.minecraft.isBotOnline(), this.discord.application.messages.minecraftBotOffline]
    ];

    for (const [failed, message] of checks) {
      if (failed) throw new HypixelDiscordChatBridgeError(message);
    }
  }
}

export default InteractionHandler;
