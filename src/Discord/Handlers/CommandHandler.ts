import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import { type AutocompleteInteraction, type ChatInputCommandInteraction, Collection, MessageFlags, REST, Routes } from "discord.js";
import { CommandResponse } from "../../Types/Discord.js";
import { readdirSync } from "node:fs";
import type Command from "../Private/Commands/Command.js";
import type DiscordManager from "../DiscordManager.js";

class CommandHandler {
  private readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await interaction.deferReply({ flags: command.response === CommandResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      console.discord(`Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${interaction.commandName}`);

      // todo: Perms checks

      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) {
        this.discord.utils.handleError(error, interaction);
      }
    }
  }

  async onAutoComplete(interaction: AutocompleteInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) {
        this.discord.utils.handleError(error, interaction);
      }
    }
  }

  async deployCommands(): Promise<void> {
    if (!this.discord.isClientOnline()) return;
    this.discord.client.commands = new Collection<string, Command>();
    const commandFiles = readdirSync("./src/Discord/Commands/", { recursive: true, encoding: "utf-8" }).filter((file) => file.endsWith(".ts"));

    const commands = [];
    for (const file of commandFiles) {
      const command: Command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (command.data.name) {
        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }

    const rest = new REST({ version: "10" }).setToken(this.discord.app.config.discord.bot.token);
    const clientID = Buffer.from(this.discord.app.config.discord.bot.token.split(".")?.[0] || "UNKNOWN", "base64").toString("ascii");

    await rest
      .put(Routes.applicationCommands(clientID), { body: commands })
      .then(() => console.discord(`Successfully reloaded ${commands.length} application command(s).`));
  }
}

export default CommandHandler;
