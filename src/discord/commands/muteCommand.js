const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
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
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    const [name, time] = [interaction.options.getString("name"), interaction.options.getString("time")];
    bot.chat(`/g mute ${name} ${time}`);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor("#57F287")
          .setAuthor({ name: "Mute" })
          .setDescription(`Successfully executed \`/g mute ${name} ${time}\``)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          }),
      ],
    });
  },
};
