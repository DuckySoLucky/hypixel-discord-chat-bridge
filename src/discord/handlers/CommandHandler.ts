import HypixelDiscordChatBridgeError from "../../private/error.js";
import { type AutocompleteInteraction, type ChatInputCommandInteraction, Collection, MessageFlags, REST, Routes } from "discord.js";
import { BasicInteractionResponse, CommandFlags } from "../../types/discord.js";
import { readdir } from "node:fs/promises";
import type DiscordCommand from "../private/commands/DiscordCommand.js";
import type DiscordManager from "../DiscordManager.js";

class CommandHandler {
  readonly commands: Collection<string, DiscordCommand> = new Collection<string, DiscordCommand>();
  constructor(private readonly discord: DiscordManager) {}

  async onCommand(interaction: ChatInputCommandInteraction) {
    const command = this.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.response !== BasicInteractionResponse.None) {
        await interaction.deferReply({ flags: command.response === BasicInteractionResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      }
      console.discord(`Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${interaction.commandName}`);

      await this.discord.interactionHandler.checkPerms(interaction, command);

      await command.execute(interaction);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.handleError(error, interaction);
    }
  }

  async onAutoComplete(interaction: AutocompleteInteraction) {
    const command = this.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.autocomplete(interaction);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) this.discord.handleError(error, interaction);
    }
  }

  async deployCommands(silent: boolean = false, skipChecks: boolean = false) {
    this.commands.clear();
    const commandFiles = await readdir("./src/discord/commands/", { recursive: true, encoding: "utf-8" }).then((files) => files.filter((file) => file.endsWith(".ts")));

    const commands = [];
    for (const file of commandFiles) {
      const command: DiscordCommand = new (await import(`../commands/${file}`)).default(this.discord);
      if (command.data.name) {
        if (!skipChecks) {
          if (command.flags.includes(CommandFlags.BlacklistCommand) && !this.discord.application.config.verification.inactivity.enabled) continue;
          if (command.flags.includes(CommandFlags.VerificationCommand) && !this.discord.application.config.verification.enabled) continue;
          if (command.flags.includes(CommandFlags.BlacklistCommand) && !this.discord.application.config.blacklist.enabled) continue;
        }

        commands.push(command.data.toJSON());
        this.commands.set(command.data.name, command);
      }
    }

    if (silent) return;

    const rest = new REST({ version: "10" }).setToken(this.discord.application.config.discord.token);
    const clientId = Buffer.from(this.discord.application.config.discord.token.split(".")?.[0] || "UNKNOWN", "base64").toString("ascii");

    await rest
      .put(Routes.applicationGuildCommands(clientId, this.discord.application.config.discord.serverId), { body: commands })
      .then(() => console.discord(`Successfully reloaded ${commands.length} application command(s).`));
  }
}

export default CommandHandler;
