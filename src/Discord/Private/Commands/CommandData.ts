import {
  ApplicationIntegrationType,
  InteractionContextType,
  type SlashCommandAttachmentOption,
  type SlashCommandBooleanOption,
  SlashCommandBuilder,
  type SlashCommandChannelOption,
  type SlashCommandIntegerOption,
  type SlashCommandMentionableOption,
  type SlashCommandNumberOption,
  type SlashCommandRoleOption,
  type SlashCommandStringOption,
  type SlashCommandSubcommandBuilder,
  type SlashCommandSubcommandGroupBuilder,
  type SlashCommandUserOption
} from "discord.js";

class CommandData extends SlashCommandBuilder {
  constructor() {
    super();
    this.setContexts(InteractionContextType.Guild);
    this.setIntegrationTypes(ApplicationIntegrationType.GuildInstall);
  }

  override setName(name: string): this {
    super.setName(name);
    return this;
  }

  override setDescription(description: string): this {
    super.setDescription(description);
    return this;
  }

  override addAttachmentOption(input: SlashCommandAttachmentOption | ((builder: SlashCommandAttachmentOption) => SlashCommandAttachmentOption)): this {
    super.addAttachmentOption(input);
    return this;
  }

  override addBooleanOption(input: SlashCommandBooleanOption | ((builder: SlashCommandBooleanOption) => SlashCommandBooleanOption)): this {
    super.addBooleanOption(input);
    return this;
  }

  override addChannelOption(input: SlashCommandChannelOption | ((builder: SlashCommandChannelOption) => SlashCommandChannelOption)): this {
    super.addChannelOption(input);
    return this;
  }

  override addIntegerOption(input: SlashCommandIntegerOption | ((builder: SlashCommandIntegerOption) => SlashCommandIntegerOption)): this {
    super.addIntegerOption(input);
    return this;
  }

  override addMentionableOption(input: SlashCommandMentionableOption | ((builder: SlashCommandMentionableOption) => SlashCommandMentionableOption)): this {
    super.addMentionableOption(input);
    return this;
  }

  override addNumberOption(input: SlashCommandNumberOption | ((builder: SlashCommandNumberOption) => SlashCommandNumberOption)): this {
    super.addNumberOption(input);
    return this;
  }

  override addRoleOption(input: SlashCommandRoleOption | ((builder: SlashCommandRoleOption) => SlashCommandRoleOption)): this {
    super.addRoleOption(input);
    return this;
  }

  override addStringOption(input: SlashCommandStringOption | ((builder: SlashCommandStringOption) => SlashCommandStringOption)): this {
    super.addStringOption(input);
    return this;
  }

  override addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): this {
    super.addSubcommand(input);
    return this;
  }

  override addSubcommandGroup(
    input: SlashCommandSubcommandGroupBuilder | ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder)
  ): this {
    super.addSubcommandGroup(input);
    return this;
  }

  override addUserOption(input: SlashCommandUserOption | ((builder: SlashCommandUserOption) => SlashCommandUserOption)): this {
    super.addUserOption(input);
    return this;
  }
}

export default CommandData;
