const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "unmute",
  description: "Unmutes the given user.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (user.roles.cache.has(config.discord.roles.commandRole) === false) {
      throw new Error("You do not have permission to use this command.");
    }

    const name = interaction.options.getString("name");
    bot.chat(`/g unmute ${name}`);

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Unmute" })
      .setDescription(`Successfully executed \`/g unmute ${name}\``)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
