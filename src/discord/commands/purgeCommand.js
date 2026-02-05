const { SlashCommandBuilder } = require("discord.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge x messages from a channel.")
    .addIntegerOption((option) => option.setName("amount").setDescription("The amount of messages to purge. (5 by default)")),
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction) => {
    const amount = interaction.options.getInteger("amount") ?? 5;
    if (amount < 1 || amount > 100) {
      throw new HypixelDiscordChatBridgeError("You can only purge between 1 and 100 messages.");
    }

    await interaction.channel.bulkDelete(amount);
  }
};
