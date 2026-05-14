import axios from "axios";
import { Collection } from "discord.js";
import { readdirSync } from "node:fs";
import type Command from "../Private/Command.js";
import type MinecraftManager from "../MinecraftManager.js";

class CommandHandler {
  private readonly minecraft: MinecraftManager;
  private readonly commands: Collection<string, Command> = new Collection<string, Command>();
  readonly prefix: string;
  constructor(minecraft: MinecraftManager) {
    this.minecraft = minecraft;
    this.prefix = this.minecraft.app.config.minecraft.bot.prefix;
  }

  handle(player: string, message: string, officer: boolean) {
    if (!this.minecraft.isBotOnline()) return;
    if (!message.startsWith(this.prefix) && !message.startsWith("-")) return;

    if (message.startsWith(this.prefix)) {
      if (this.minecraft.app.config.minecraft.commands.normal === false) return;
      const args = message.slice(this.prefix.length).trim().split(/ +/);
      if (!args) return;
      const commandName = args.shift() ?? "".toLowerCase();
      const command = this.commands.get(commandName) ?? this.commands.find((cmd) => cmd.data.getAliases() && cmd.data.getAliases().includes(commandName));

      if (command === undefined) return;

      console.minecraft(`${player} - [${command.data.getName}] ${message}`);
      command.officer = officer;
      command.execute(player, message);
    } else if (message.startsWith("-") && message.startsWith("- ") === false) {
      if (this.minecraft.app.config.minecraft.commands.soopy === false || message.at(1) === "-") return;

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
          if (!(error instanceof Error)) return;
          this.minecraft.bot.chat(`/${chat} [SOOPY V2] ${error.cause ?? error.message ?? "Unknown error"}`);
        }
      })();
    }
  }

  async deployCommands(): Promise<void> {
    this.commands.clear();

    const commandFiles = readdirSync("./src/Minecraft/Commands/", { recursive: true, encoding: "utf-8" }).filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const command: Command = new (await import(`../Commands/${file}`)).default(this.minecraft);
      if (!command.data.getName()) continue;
      this.commands.set(command.data.getName(), command);
    }
    console.minecraft(`Successfully reloaded ${this.commands.size} minecraft command(s).`);
  }
}

export default CommandHandler;
