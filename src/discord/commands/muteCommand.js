const { SlashCommandBuilder } = require("discord.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutes the given user for a given amount of time.")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true))
    .addStringOption((option) => option.setName("time").setDescription("Time").setRequired(true)),
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction) => {
    const [name, time] = [interaction.options.getString("username"), interaction.options.getString("time")];
    bot.chat(`/g mute ${name} ${time}`);

    const embed = new SuccessEmbed(`Successfully muted **${name}** for ${time}.`);

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
