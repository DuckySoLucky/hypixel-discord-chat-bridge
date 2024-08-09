const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { getTimestamp } = require("../../contracts/helperFunctions.js");
const { readFileSync, unlinkSync, writeFileSync } = require("fs");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "close-ticket",
  description: "Close a support ticket.",
  moderatorOnly: true,
  ticketCommand: true,
  options: [
    {
      name: "reason",
      description: "The reason for opening a ticket",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    if (!interaction.channel.name.toLowerCase().startsWith("ticket-")) {
      throw new HypixelDiscordChatBridgeError("This is not a ticket channel");
    }

    const closeReason = interaction.options?.getString("reason") ?? "No Reason Provided";
    const firstMessage = (await interaction.channel.messages.fetchPinned()).first();
    let openReason = "No Reason Provided";
    if (firstMessage.content.includes(" | ")) openReason = firstMessage.content.split(" | ")[1];
    const closeTimestamp = Math.floor(Date.now() / 1000);

    let messages = [];
    let lastMessageId = null;

    do {
      const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId });
      if (fetchedMessages.size === 0) break;

      fetchedMessages.forEach((msg) => messages.push(msg));
      lastMessageId = fetchedMessages.last().id;
    } while (true);

    messages = messages
      .filter((msg) => !msg.author.bot || msg.author.id === interaction.client.user.id)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    let TranscriptString = "";
    messages.forEach((msg) => {
      TranscriptString += `[${getTimestamp(msg.createdTimestamp)}] | @${msg.author.username} (${msg.author.id}) | ${msg.content}\n`;
    });

    writeFileSync(`data/transcript-${interaction.channel.name}.txt`, TranscriptString);

    const ticketCloseEmbed = new EmbedBuilder()
      .setColor(3447003)
      .setTitle("Ticket Closed")
      .addFields(
        {
          name: "Ticket Open",
          value: `by: <@${firstMessage.mentions.users.first().id}>\nTimestamp: <t:${Math.floor(firstMessage.createdTimestamp / 1000)}> (<t:${Math.floor(firstMessage.createdTimestamp / 1000)}:R>)\nReason: ${openReason}`,
        },
        {
          name: "Ticket Closed",
          value: `by: <@${interaction.user.id}>\nTimestamp: <t:${closeTimestamp}> (<t:${closeTimestamp}:R>)\nReason: ${closeReason}`,
        },
      )
      .setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      });

    const ticketLogs = await interaction.client.channels.cache.get(config.tickets.logChannel);

    if (ticketLogs) {
      await ticketLogs.send({
        embeds: [ticketCloseEmbed],
        files: [`data/transcript-${interaction.channel.name}.txt`],
      });
    } else {
      await interaction.followUp({ content: "Ticket Logs Channel not found. Not sending log", ephemeral: true });
    }

    try {
      await interaction.client.users.send(firstMessage.mentions.users.first().id, {
        embeds: [ticketCloseEmbed],
        files: [`data/transcript-${interaction.channel.name}.txt`],
      });
    } catch (e) {
      await interaction.followUp({ content: "User has DMs disabled", ephemeral: true });
    }

    unlinkSync(`data/transcript-${interaction.channel.name}.txt`);

    let ticketsData = JSON.parse(readFileSync("data/tickets.json"));
    ticketsData = ticketsData.filter((ticket) => ticket.channel !== interaction.channel.id);
    writeFileSync("data/tickets.json", JSON.stringify(ticketsData));

    await interaction.followUp({ content: "Ticket Closed", ephemeral: true });
    await interaction.channel.delete();
  },
};
