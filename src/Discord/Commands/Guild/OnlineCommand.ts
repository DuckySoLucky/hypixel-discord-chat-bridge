import Command from "../../Private/Commands/Command.js";
import CommandData from "../../Private/Commands/CommandData.js";
import Embed from "../../Private/Embed.js";
import HypixelDiscordChatBridgeError from "../../../Private/Error.js";
import { CommandFlags, type DiscordManagerWithBot, type OnlineMembers, type OnlineMembersGroup } from "../../../Types/Discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { ChatMessage } from "prismarine-chat";

class OnlineCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName("online").setDescription("List of online members.");
    this.flags = [CommandFlags.RequiresMinecraftBot];
  }

  getMessages(): Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      const cachedMessages: string[] = [];
      const listener = (rawMessage: ChatMessage) => {
        const message = rawMessage.toString();
        cachedMessages.push(message);

        if (message.startsWith("Offline Members")) {
          this.discord.app.minecraft.bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      this.discord.app.minecraft.bot.on("message", listener);
      this.discord.app.minecraft.bot.chat("/g online");

      setTimeout(() => {
        this.discord.app.minecraft.bot.removeListener("message", listener);
        resolve(cachedMessages);
      }, 5000);
    });
  }

  async getOnlineMembers(): Promise<OnlineMembers> {
    const messages = await this.getMessages();
    let onlineString = messages.find((message) => message.startsWith("Online Members: "));
    if (onlineString === undefined) throw new HypixelDiscordChatBridgeError("The online members message is missing. Is the bot's hypixel language english?");
    const online = Number(onlineString.split("Online Members: ")?.[1] || "0");
    onlineString = `"**Online:** ${online}`;

    let totalString = messages.find((message) => message.startsWith("Total Members: "));
    if (totalString === undefined) throw new HypixelDiscordChatBridgeError("The total members message is missing. Is the bot's hypixel language english?");
    const total = Number(totalString.split("Total Members: ")?.[1] || "0");
    totalString = `**Total:** ${total}`;

    const groups: OnlineMembersGroup[] = [];
    messages.flatMap((item, index) => {
      if (!item.includes("-- ")) return;
      const nextLine = messages[index + 1];
      if (!nextLine) return;
      if (!nextLine.includes("●")) return;
      const rank = item.replaceAll("--", "").trim();
      const players = nextLine
        .split("●")
        .map((item) => item.trim())
        .filter((item) => item);
      if (rank === undefined || players === undefined) return;
      groups.push({ name: rank, value: players.map((player) => `\`${player}\``).join(", ") });
    });

    return { online, onlineString, total, totalString, groups };
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const { groups, totalString, onlineString } = await this.getOnlineMembers();
    await interaction.followUp({ embeds: [new Embed().setTitle("Online Members").setDescription(`${totalString}\n${onlineString}`).setFields(groups)] });
  }
}

export default OnlineCommand;
