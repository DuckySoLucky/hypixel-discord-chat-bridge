const { SlashCommandBuilder } = require("discord.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("demote")
    .setDescription("Demotes the given user by one guild rank.")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true)),
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction) => {
    const name = interaction.options.getString("username");
    bot.chat(`/g demote ${name}`);

    const embed = new SuccessEmbed(`Successfully demoted \`${name}\` by one guild rank.`);

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
