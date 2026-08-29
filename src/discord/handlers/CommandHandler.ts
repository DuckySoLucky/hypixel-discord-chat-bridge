import ExtensionRegistry from "../../extensions/ExtensionRegistry.js";
import loadExtensionModules from "../../extensions/moduleLoader.js";
import { type AutocompleteInteractionWithGuild, BasicInteractionResponse, type ChatInputCommandInteractionWithGuild, CommandFlags } from "../../types/discord.js";
import { MessageFlags, REST, Routes } from "discord.js";
import { toError } from "../../utils/asyncUtils.js";
import type DiscordCommand from "../private/commands/DiscordCommand.js";
import type DiscordManager from "../DiscordManager.js";

class CommandHandler {
  readonly #commands = new ExtensionRegistry<DiscordCommand<DiscordManager>>();
  constructor(private readonly discord: DiscordManager) {}

  async onCommand(interaction: ChatInputCommandInteractionWithGuild) {
    const command = this.#commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.response !== BasicInteractionResponse.None) {
        await interaction.deferReply({ flags: command.response === BasicInteractionResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${interaction.commandName}`);

      await this.discord.interactionHandler.checkPerms(interaction.member, command);

      await command.execute(interaction);
    } catch (error: unknown) {
      await this.discord.handleError(toError(error), interaction);
    }
  }

  async onAutoComplete(interaction: AutocompleteInteractionWithGuild) {
    const command = this.#commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.autocomplete(interaction);
    } catch (error: unknown) {
      await this.discord.handleError(toError(error), interaction);
    }
  }

  async deployCommands(silent: boolean = false, skipChecks: boolean = false) {
    await this.loadCommands(skipChecks);
    if (silent) return;

    await this.deployRegisteredCommands();
  }

  async deployRegisteredCommands(): Promise<void> {
    const commands = this.#commands.values().map((command) => command.data.toJSON());

    const rest = new REST({ version: "10" }).setToken(this.discord.application.config.discord.token);
    const clientId = Buffer.from(this.discord.application.config.discord.token.split(".")?.[0] || "UNKNOWN", "base64").toString("ascii");

    await rest.put(Routes.applicationGuildCommands(clientId, this.discord.application.config.discord.serverId), { body: commands });
    console.discord(`Successfully reloaded ${commands.length} application command(s).`);
  }

  async loadCommands(skipChecks: boolean = false): Promise<readonly ReturnType<DiscordCommand["data"]["toJSON"]>[]> {
    this.#commands.clear();
    const modules = await loadExtensionModules<DiscordCommand<DiscordManager>, DiscordManager>(new URL("../commands/", import.meta.url), this.discord);
    const commands: ReturnType<DiscordCommand["data"]["toJSON"]>[] = [];
    for (const { extension: command, source } of modules) {
      if (command.data.name) {
        if (!skipChecks) {
          if (command.flags.includes(CommandFlags.BlacklistCommand) && !this.discord.application.config.verification.inactivity.enabled) continue;
          if (command.flags.includes(CommandFlags.VerificationCommand) && !this.discord.application.config.verification.enabled) continue;
          if (command.flags.includes(CommandFlags.BlacklistCommand) && !this.discord.application.config.blacklist.enabled) continue;
        }

        commands.push(command.data.toJSON());
        this.#commands.register(command.data.name, command, [], source);
      }
    }
    return commands;
  }

  get commands(): readonly DiscordCommand<DiscordManager>[] {
    return this.#commands.values();
  }

  getCommand(name: string): DiscordCommand<DiscordManager> | undefined {
    return this.#commands.get(name);
  }

  registerCommand(command: DiscordCommand<DiscordManager>, source: string = "programmatic"): void {
    this.#commands.register(command.data.name, command, [], source);
  }
}

export default CommandHandler;
