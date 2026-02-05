const { SlashCommandBuilder } = require("discord.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invites the given user to the guild.")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true)),
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction) => {
    const name = interaction.options.getString("username");
    bot.chat(`/g invite ${name}`);

    const embed = new SuccessEmbed(`Successfully invited **${name}** to the guild.`);

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
