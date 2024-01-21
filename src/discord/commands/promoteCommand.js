const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "promote",
  description: "Promotes the given user by one guild rank.",
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
    bot.chat(`/g promote ${name}`);

    const embed = new SuccessEmbed(`Successfully promoted \`${name}\` by one guild rank.`);

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
