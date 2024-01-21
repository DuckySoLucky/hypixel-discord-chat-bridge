const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "invite",
  description: "Invites the given user to the guild.",
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const name = interaction.options.getString("name");
    bot.chat(`/g invite ${name}`);

    const embed = new SuccessEmbed(`Successfully invited **${name}** to the guild.`);

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
