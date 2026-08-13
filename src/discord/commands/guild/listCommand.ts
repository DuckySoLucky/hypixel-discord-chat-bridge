import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import Embed from "../../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, type DiscordManagerWithBot, type ListMembers, type ListMembersGroup } from "../../../types/discord.js";
import { MinecraftRequestTimeoutError } from "../../../minecraft/MinecraftRequestBroker.js";
import { removeColorCodes } from "../../../utils/stringUtils.js";

class ListCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandData().setName("list").setDescription("List of guild members.");
  override readonly flags = [CommandFlags.RequiresMinecraftBot];

  async getMessages(): Promise<string[]> {
    const cachedMessages: string[] = [];
    const response = this.discord.application.minecraft.requestBroker.request({
      description: "Hypixel guild list",
      timeoutMs: this.commandTimeout,
      matches: (message) => {
        cachedMessages.push(message);
        return message.startsWith("Online Members");
      },
      map: () => cachedMessages
    });
    this.discord.application.minecraft.bot.chat("/g list");
    try {
      return await response;
    } catch (error: unknown) {
      if (error instanceof MinecraftRequestTimeoutError) return cachedMessages;
      throw error;
    }
  }

  async getListMembers(): Promise<ListMembers> {
    const messages = await this.getMessages();
    if (messages.length === 0) throw new HypixelDiscordChatBridgeError("Could not retrieve the guild list.");

    let onlineString = messages.map((message) => removeColorCodes(message)).find((message) => message.startsWith("Online Members: "));
    if (onlineString === undefined) throw new HypixelDiscordChatBridgeError("The online members message is missing. Is the bot's hypixel language english?");
    const online = Number(onlineString.split("Online Members: ")?.[1] || "0");
    onlineString = `**Online:** ${online}`;

    let totalString = messages.map((message) => removeColorCodes(message)).find((message) => message.startsWith("Total Members: "));
    if (totalString === undefined) throw new HypixelDiscordChatBridgeError("The total members message is missing. Is the bot's hypixel language english?");
    const total = Number(totalString.split("Total Members: ")?.[1] || "0");
    totalString = `**Total:** ${total}`;

    const groups: ListMembersGroup[] = [];
    messages.flatMap((item, index) => {
      if (!item.includes("-- ")) return;
      const nextLine = messages[index + 1];
      if (!nextLine) return;
      if (!nextLine.includes("●")) return;
      const rank = removeColorCodes(item.replaceAll("--", "")).trim();
      const players = nextLine
        .split("●")
        .map((item) => item.trim())
        .map((item) => {
          if (item.endsWith("§a")) return `● ${item}`;
          return item;
        })
        .map((item) => removeColorCodes(item))
        .map((item) => item.trim())
        .filter((item) => item);
      if (rank === undefined || players === undefined) return;
      groups.push({ name: rank, value: players.map((player) => `\`${player}\``).join(", ") });
    });

    return { online, onlineString, total, totalString, groups };
  }

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const { groups, totalString, onlineString } = await this.getListMembers();
    await interaction.followUp({ embeds: [new Embed().setTitle("List Members").setDescription(`${totalString}\n${onlineString}`).setFields(groups)] });
  }
}

export default ListCommand;
