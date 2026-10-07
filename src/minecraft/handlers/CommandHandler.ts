import ExtensionRegistry from "../../extensions/ExtensionRegistry.js";
import axios from "axios";
import loadExtensionModules from "../../extensions/moduleLoader.js";
import { Collection } from "discord.js";
import { formatError } from "../../utils/miscUtils.js";
import { toError } from "../../utils/asyncUtils.js";
import type MinecraftCommand from "../private/commands/MinecraftCommand.js";
import type MinecraftManager from "../MinecraftManager.js";
import type { SoopyCommandData, SoopyCommandListResponse, SoopyCommandResponse } from "../../types/minecraft.ts";

class CommandHandler {
  readonly #commands = new ExtensionRegistry<MinecraftCommand<MinecraftManager>>();
  readonly #soopyCommands = new Collection<string, SoopyCommandData>();
  constructor(private readonly minecraft: MinecraftManager) {}

  findNormalCommand(name: string): MinecraftCommand<MinecraftManager> | undefined {
    return this.#commands.get(name);
  }

  findSoopyCommand(name: string): SoopyCommandData | undefined {
    return this.#soopyCommands.get(name) ?? this.#soopyCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
  }

  async handle(player: string, message: string, officer: boolean) {
    if (!this.minecraft.isBotOnline()) return;
    if (
      !message.startsWith(this.minecraft.application.config.minecraft.commands.normal.prefix) &&
      !message.startsWith(this.minecraft.application.config.minecraft.commands.soopy.prefix)
    ) {
      return;
    }

    if (message.startsWith(this.minecraft.application.config.minecraft.commands.normal.prefix)) {
      if (this.minecraft.application.config.minecraft.commands.normal.enabled === false) return;
      const args = message.slice(this.minecraft.application.config.minecraft.commands.normal.prefix.length).trim().split(/ +/);
      const commandName = (args.shift() ?? "").toLowerCase();
      const command = this.findNormalCommand(commandName);
      if (command === undefined) return;
      console.minecraft(`${player} - [${command.data.name}] ${message}`);
      const abortController = new AbortController();
      try {
        await command.run({ player, rawMessage: message, args, channel: officer ? "officer" : "guild", signal: abortController.signal });
      } catch (error) {
        await this.minecraft.application.logError(toError(error));
        if (!(error instanceof Error)) return;
        await command.send(formatError(error));
      }
    } else if (message.startsWith(this.minecraft.application.config.minecraft.commands.soopy.prefix)) {
      if (
        this.minecraft.application.config.minecraft.commands.soopy.enabled === false ||
        message.at(1) === this.minecraft.application.config.minecraft.commands.soopy.prefix
      ) {
        return;
      }

      const command = message.slice(1).split(" ")[0];
      if (!command) return;
      if (isNaN(parseInt(command.replace(/[^-()\d/*+.]/g, ""))) === false) return;
      const commandData = this.findSoopyCommand(command);
      if (!commandData) return;

      const chat = officer ? "oc" : "gc";
      console.minecraft(`${player} - [${command}] ${message}`);
      await this.handleSoopyCommand(chat, player, commandData);
    }
  }

  private async handleSoopyCommand(chat: string, player: string, commandData: SoopyCommandData) {
    if (!this.minecraft.isBotOnline()) return;
    try {
      const cached = this.minecraft.application.cache.get<SoopyCommandResponse>(`minecraft:commands:soopy:${commandData.command}:${player}`);
      if (cached) return this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${cached.raw}`);
      const response = await axios.get<SoopyCommandResponse>(
        encodeURI(`${this.minecraft.application.config.API.soopy.baseURL}/guildBot/runCommand?user=${player}&cmd=${commandData.command}`)
      );
      if (!response.data.success) return this.minecraft.bot.chat(`/${chat} [SOOPY V2] An error occured while running the command`);
      this.minecraft.application.cache.set(`minecraft:commands:soopy:${commandData.command}:${player}`, response.data);
      return this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${response.data.raw}`);
    } catch (error) {
      await this.minecraft.application.logError(toError(error));
      if (!(error instanceof Error)) return;
      this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${error.cause ?? error.message ?? "Unknown error"}`);
    }
  }

  async loadCommands(silent: boolean = false): Promise<void> {
    this.#commands.clear();
    const modules = await loadExtensionModules<MinecraftCommand<MinecraftManager>, MinecraftManager>(new URL("../commands/", import.meta.url), this.minecraft);
    for (const { extension: command, source } of modules) {
      if (!command.data.name) continue;
      this.#commands.register(command.data.name, command, command.data.aliases, source);
    }
    if (!silent) console.minecraft(`Successfully reloaded ${this.#commands.size} minecraft command(s).`);
  }

  async loadSoopyCommands(silent: boolean = false): Promise<void> {
    this.#soopyCommands.clear();
    const commands = await axios.get<SoopyCommandListResponse>("https://soopy.dev/commands/list");
    commands.data.defaultCommands.filter((command) => !command.modOnly).forEach((command) => this.#soopyCommands.set(command.command, command));
    if (!silent) console.minecraft(`Successfully loaded ${this.#soopyCommands.size} soopy command(s).`);
  }

  async deployCommands(silent: boolean = false): Promise<void> {
    if (this.minecraft.application.config.minecraft.commands.normal.enabled) await this.loadCommands(silent);
    if (this.minecraft.application.config.minecraft.commands.soopy.enabled) await this.loadSoopyCommands(silent);
  }

  get commands(): readonly MinecraftCommand<MinecraftManager>[] {
    return this.#commands.values();
  }

  registerCommand(command: MinecraftCommand<MinecraftManager>, source: string = "programmatic"): void {
    this.#commands.register(command.data.name, command, command.data.aliases, source);
  }
}

export default CommandHandler;
