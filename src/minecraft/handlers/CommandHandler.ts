import axios from "axios";
import { Collection } from "discord.js";
import { formatError } from "../../utils/miscUtils.js";
import { readdir } from "node:fs/promises";
import type MinecraftCommand from "../private/commands/MinecraftCommand.js";
import type MinecraftManager from "../MinecraftManager.js";

class CommandHandler {
  readonly commands: Collection<string, MinecraftCommand> = new Collection<string, MinecraftCommand>();
  constructor(private readonly minecraft: MinecraftManager) {}

  findNormalCommand(name: string): MinecraftCommand | undefined {
    return this.commands.get(name) ?? this.commands.find((cmd) => cmd.data.aliases && cmd.data.aliases.includes(name));
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
      if (!args) return;
      const commandName = args.shift() ?? "".toLowerCase();
      const command = this.findNormalCommand(commandName);
      if (command === undefined) return;
      console.minecraft(`${player} - [${command.data.name}] ${message}`);
      command.officer = officer;
      try {
        await command.execute(player, message);
      } catch (error) {
        console.error(error);
        if (!(error instanceof Error)) return;
        command.send(formatError(error));
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
          console.error(error);
          if (!(error instanceof Error)) return;
          this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${error.cause ?? error.message ?? "Unknown error"}`);
        }
      })();
    }
  }

  async deployCommands(silent: boolean = false) {
    this.commands.clear();
    const commandFiles = await readdir("./src/minecraft/commands/", { recursive: true, encoding: "utf-8" }).then((files) => files.filter((file) => file.endsWith(".ts")));
    for (const file of commandFiles) {
      const command: MinecraftCommand = new (await import(`../commands/${file}`)).default(this.minecraft);
      if (!command.data.name) continue;
      this.commands.set(command.data.name, command);
    }
    if (!silent) console.minecraft(`Successfully reloaded ${this.commands.size} minecraft command(s).`);
  }
}

export default CommandHandler;
