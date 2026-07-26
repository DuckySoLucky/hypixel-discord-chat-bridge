import DiscordSubCommandData from "./DiscordSubCommandData.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import {
  ApplicationIntegrationType,
  InteractionContextType,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type SlashCommandAttachmentOption,
  type SlashCommandBooleanOption,
  SlashCommandBuilder,
  type SlashCommandChannelOption,
  type SlashCommandIntegerOption,
  type SlashCommandMentionableOption,
  type SlashCommandNumberOption,
  type SlashCommandRoleOption,
  type SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  type SlashCommandUserOption
} from "discord.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type { ParseKeys } from "i18next";

class DiscordCommandData extends SlashCommandBuilder {
  constructor() {
    super();
    this.setContexts(InteractionContextType.Guild);
    this.setIntegrationTypes(ApplicationIntegrationType.GuildInstall);
  }

  override setName(name: string): this {
    super.setName(name);
    super.setDescription(translate(`discord.commands.${name}.description` as ParseKeys));
    return this;
  }

  override setDescription(_: string): this {
    throw new HypixelDiscordChatBridgeError(translate("discord.errors.commands.set.description"));
  }

  override addAttachmentOption(input: (builder: SlashCommandAttachmentOption) => SlashCommandAttachmentOption): this {
    super.addAttachmentOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addBooleanOption(input: (builder: SlashCommandBooleanOption) => SlashCommandBooleanOption): this {
    super.addBooleanOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addChannelOption(input: (builder: SlashCommandChannelOption) => SlashCommandChannelOption): this {
    super.addChannelOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addIntegerOption(input: (builder: SlashCommandIntegerOption) => SlashCommandIntegerOption): this {
    super.addIntegerOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addMentionableOption(input: (builder: SlashCommandMentionableOption) => SlashCommandMentionableOption): this {
    super.addMentionableOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addNumberOption(input: (builder: SlashCommandNumberOption) => SlashCommandNumberOption): this {
    super.addNumberOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addRoleOption(input: (builder: SlashCommandRoleOption) => SlashCommandRoleOption): this {
    super.addRoleOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addStringOption(input: (builder: SlashCommandStringOption) => SlashCommandStringOption): this {
    super.addStringOption((option) => input(option).setDescription(" "));
    return this;
  }

  override addSubcommand(input: (builder: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder): this {
    this.options.push(input(new DiscordSubCommandData().setCommandName(this.name)));
    return this;
  }

  override addUserOption(input: (builder: SlashCommandUserOption) => SlashCommandUserOption): this {
    super.addUserOption((option) => input(option).setDescription(" "));
    return this;
  }

  override toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
    const result = super.toJSON();
    for (const option of result.options ?? []) {
      option.description = translate(`discord.commands.${this.name}.options.${option.name}.description` as ParseKeys);
    }
    return result;
  }
}

export default DiscordCommandData;
