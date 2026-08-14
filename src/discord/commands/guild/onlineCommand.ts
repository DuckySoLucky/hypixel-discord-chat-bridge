import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import EmbedHelper from "../../private/EmbedHelper.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, type DiscordManagerWithBot, type ListMembers, type ListMembersGroup } from "../../../types/discord.js";
import { MinecraftRequestTimeoutError } from "../../../minecraft/MinecraftRequestBroker.js";

class OnlineCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder().setName("online").setDescription("List of online members.");
  override readonly flags = [CommandFlags.RequiresMinecraftBot];

  async getMessages(): Promise<string[]> {
    const cachedMessages: string[] = [];
    const response = this.discord.application.minecraft.requestBroker.request({
      description: "Hypixel guild online list",
      timeoutMs: this.commandTimeout,
      matches: (message) => {
        cachedMessages.push(message);
        return message.startsWith("Offline Members");
      },
      map: () => cachedMessages
    });
    this.discord.application.minecraft.bot.chat("/g online");
    try {
      return await response;
    } catch (error: unknown) {
      if (error instanceof MinecraftRequestTimeoutError) return cachedMessages;
      throw error;
    }
  }

  async getOnlineMembers(): Promise<ListMembers> {
    const messages = await this.getMessages();
    if (messages.length === 0) throw new HypixelDiscordChatBridgeError("Could not retrieve the guild online.");

    let onlineString = messages.find((message) => message.startsWith("Online Members: "));
    if (onlineString === undefined) throw new HypixelDiscordChatBridgeError("The online members message is missing. Is the bot's hypixel language english?");
    const online = Number(onlineString.split("Online Members: ")?.[1] || "0");
    onlineString = `**Online:** ${online}`;

    let totalString = messages.find((message) => message.startsWith("Total Members: "));
    if (totalString === undefined) throw new HypixelDiscordChatBridgeError("The total members message is missing. Is the bot's hypixel language english?");
    const total = Number(totalString.split("Total Members: ")?.[1] || "0");
    totalString = `**Total:** ${total}`;

    const groups: ListMembersGroup[] = [];
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

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const { groups, totalString, onlineString } = await this.getOnlineMembers();
    await interaction.followUp({
      embeds: [
        new EmbedHelper()
          .setTitle("Online Members")
          .setDescription(`${totalString}\n${onlineString}`)
          .setFields(...groups)
      ]
    });
  }
}

export default OnlineCommand;
