import HypixelDiscordChatBridgeError from "../../../private/error.js";
import {
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandUserOption
} from "discord.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type { ParseKeys } from "i18next";

class DiscordSubCommandData extends SlashCommandSubcommandBuilder {
  #commandName: string = "";

  setCommandName(commandName: string): this {
    this.#commandName = commandName;
    return this;
  }

  get commandName(): string {
    return this.#commandName;
  }

  override setName(name: string): this {
    super.setName(name);
    super.setDescription(translate(`discord.commands.${this.commandName}.options.${name}.description` as ParseKeys));
    return this;
  }

  override setDescription(_: string): this {
    throw new HypixelDiscordChatBridgeError(translate("discord.errors.commands.set.description"));
  }

  override addAttachmentOption(input: (builder: SlashCommandAttachmentOption) => SlashCommandAttachmentOption): this {
    super.addAttachmentOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addBooleanOption(input: (builder: SlashCommandBooleanOption) => SlashCommandBooleanOption): this {
    super.addBooleanOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addChannelOption(input: (builder: SlashCommandChannelOption) => SlashCommandChannelOption): this {
    super.addChannelOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addIntegerOption(input: (builder: SlashCommandIntegerOption) => SlashCommandIntegerOption): this {
    super.addIntegerOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addMentionableOption(input: (builder: SlashCommandMentionableOption) => SlashCommandMentionableOption): this {
    super.addMentionableOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addNumberOption(input: (builder: SlashCommandNumberOption) => SlashCommandNumberOption): this {
    super.addNumberOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addRoleOption(input: (builder: SlashCommandRoleOption) => SlashCommandRoleOption): this {
    super.addRoleOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addStringOption(input: (builder: SlashCommandStringOption) => SlashCommandStringOption): this {
    super.addStringOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }

  override addUserOption(input: (builder: SlashCommandUserOption) => SlashCommandUserOption): this {
    super.addUserOption((option) =>
      input(option).setDescription(translate(`discord.commands.${this.commandName}.options.${this.name}.options.${option.name}.description` as ParseKeys))
    );
    return this;
  }
}

export default DiscordSubCommandData;
