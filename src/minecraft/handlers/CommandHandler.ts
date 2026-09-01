import ExtensionRegistry from "../../extensions/ExtensionRegistry.js";
import axios from "axios";
import loadExtensionModules from "../../extensions/moduleLoader.js";
import { formatError } from "../../utils/miscUtils.js";
import { runDetached, toError } from "../../utils/asyncUtils.js";
import type MinecraftCommand from "../private/commands/MinecraftCommand.js";
import type MinecraftManager from "../MinecraftManager.js";

class CommandHandler {
  readonly #commands = new ExtensionRegistry<MinecraftCommand<MinecraftManager>>();
  constructor(private readonly minecraft: MinecraftManager) {}

  findNormalCommand(name: string): MinecraftCommand<MinecraftManager> | undefined {
    return this.#commands.get(name);
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

      const chat = officer ? "oc" : "gc";

      this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${message}`);

      console.minecraft(`${player} - [${command}] ${message}`);
      runDetached(
        (async () => {
          if (!this.minecraft.isBotOnline()) return;
          try {
            const URI = encodeURI(`https://soopy.dev/api/guildBot/runCommand?user=${player}&cmd=${message.slice(1)}`);
            const response = await axios.get(URI);

            if (response?.data?.msg === undefined) {
              return this.minecraft.bot.chat(`/${chat} [SOOPY V2] An error occured while running the command`);
            }

            this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${response.data.msg}`);
          } catch (error) {
            await this.minecraft.application.logError(toError(error));
            if (!(error instanceof Error)) return;
            this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${error.cause ?? error.message ?? "Unknown error"}`);
          }
        })()
      );
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

  async deployCommands(silent: boolean = false): Promise<void> {
    await this.loadCommands(silent);
  }

  get commands(): readonly MinecraftCommand<MinecraftManager>[] {
    return this.#commands.values();
  }

  registerCommand(command: MinecraftCommand<MinecraftManager>, source: string = "programmatic"): void {
    this.#commands.register(command.data.name, command, command.data.aliases, source);
  }
}

export default CommandHandler;
