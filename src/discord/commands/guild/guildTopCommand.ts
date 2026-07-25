import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import Embed from "../../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class GuildTopCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
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
      const listener = (data: { positionId: number; formattedMessage: string }) => {
        const rawMessage = this.discord.application.minecraft.prismarineChat.fromNotch(data.formattedMessage);
        const message = rawMessage.toString();
        cachedMessages.push(message);

        if (message.startsWith("10.") && message.endsWith("Guild Experience")) {
          this.discord.application.minecraft.bot.removeListener("systemChat", listener);
          resolve(cachedMessages);
        }
      };

      this.discord.application.minecraft.bot.on("systemChat", listener);
      this.discord.application.minecraft.bot.chat(`/g top ${time || ""}`);

      setTimeout(() => {
        this.discord.application.minecraft.bot.removeListener("systemChat", listener);
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
