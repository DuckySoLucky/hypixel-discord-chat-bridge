import Command from "../../Private/Commands/Command.js";
import CommandData from "../../Private/Commands/CommandData.js";
import Embed from "../../Private/Embed.js";
import HypixelDiscordChatBridgeError from "../../../Private/Error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../Types/Discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { ChatMessage } from "prismarine-chat";

class GuildTopCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("guildtop")
      .setDescription("Top 10 members with the most guild experience.")
      .addStringOption((option) =>
        option
          .setName("time")
          .setDescription("Days ago")
          .addChoices(...Array.from({ length: 14 }, (_, index) => ({ name: `${index + 1} Day ago`, value: (index + 1).toString() })))
      );
    this.flags = [CommandFlags.RequiresMinecraftBot];
  }

  getMessages(time: string | null): Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      const cachedMessages: string[] = [];
      const listener = (rawMessage: ChatMessage) => {
        const message = rawMessage.toString();
        cachedMessages.push(message);

        if (message.startsWith("10.") && message.endsWith("Guild Experience")) {
          this.discord.app.minecraft.bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      this.discord.app.minecraft.bot.on("message", listener);
      this.discord.app.minecraft.bot.chat(`/g top ${time || ""}`);

      setTimeout(() => {
        this.discord.app.minecraft.bot.removeListener("message", listener);
        resolve(cachedMessages);
      }, 1000);
    });
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const messages = await this.getMessages(interaction.options.getString("time"));
    if (messages.length === 0) throw new HypixelDiscordChatBridgeError("Could not retrieve the top 10 guild members.");
    const trimmedMessages = messages.map((message) => message.trim()).filter((message) => message.includes("."));

    const description = trimmedMessages
      .map((message) => {
        const parts = message.split(" ");
        if (parts.length < 4) return "";

        const [position, mightBeName, tempName, tempGuildExperience] = parts;

        const cleanedExp = (tempGuildExperience || "").replace(/`/g, "");
        const isExperience = !isNaN(parseInt(cleanedExp, 10));

        const name = isExperience ? tempName : mightBeName;
        const guildExperience = isExperience ? tempGuildExperience : tempName;

        return `\`${position}\` **${name}** - \`${guildExperience}\` Guild Experience\n`;
      })
      .join("");

    if (!description) throw new HypixelDiscordChatBridgeError("Failed to parse the top 10 guild members data.");
    await interaction.followUp({ embeds: [new Embed().setAuthor({ name: "Top 10 Guild Members" }).setDescription(description)] });
  }
}

export default GuildTopCommand;
