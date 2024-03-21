const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unmute",
  description: "Unmutes the given user.",
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
    bot.chat(`/g unmute ${name}`);

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Unmute" })
      .setDescription(`Successfully executed \`/g unmute ${name}\``)
      .setFooter({
        text: `/help [command] for more information`,
        iconURL: "https://i.imgur.com/vt9IRtV.png",
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
