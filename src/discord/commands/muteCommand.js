const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "mute",
  description: "Mutes the given user for a given amount of time.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "time",
      description: "Time",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (user.roles.cache.has(config.discord.roles.commandRole) === false) {
      throw new Error("You do not have permission to use this command.");
    }

    const [name, time] = [interaction.options.getString("name"), interaction.options.getString("time")];
    bot.chat(`/g mute ${name} ${time}`);

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Mute" })
      .setDescription(`Successfully executed \`/g mute ${name} ${time}\``)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
