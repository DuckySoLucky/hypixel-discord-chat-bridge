import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import Embed from "../../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { CommandFlags, type DiscordManagerWithBot, type ListMembers, type ListMembersGroup } from "../../../types/discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

class OnlineCommand extends DiscordCommand<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData().setName("online").setDescription("List of online members.");
    this.flags = [CommandFlags.RequiresMinecraftBot];
  }

  getMessages(): Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      const cachedMessages: string[] = [];
      const listener = (data: { positionId: number; formattedMessage: string }) => {
        const rawMessage = this.discord.application.minecraft.prismarineChat.fromNotch(data.formattedMessage);
        const message = rawMessage.toString();
        cachedMessages.push(message);

        if (message.startsWith("Offline Members")) {
          this.discord.application.minecraft.bot.removeListener("systemChat", listener);
          resolve(cachedMessages);
        }
      };

      this.discord.application.minecraft.bot.on("systemChat", listener);
      this.discord.application.minecraft.bot.chat("/g online");

      setTimeout(() => {
        this.discord.application.minecraft.bot.removeListener("systemChat", listener);
        resolve(cachedMessages);
      }, this.commandTimeout);
    });
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

  override async execute(interaction: ChatInputCommandInteraction) {
    const { groups, totalString, onlineString } = await this.getOnlineMembers();
    await interaction.followUp({ embeds: [new Embed().setTitle("Online Members").setDescription(`${totalString}\n${onlineString}`).setFields(groups)] });
  }
}

export default OnlineCommand;
