const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
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
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    const name = interaction.options.getString("name");
    bot.chat(`/g unmute ${name}`);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(config.discord.other.colors.success)
          .setAuthor({ name: "Unmute" })
          .setDescription(`Successfully executed \`/g unmute ${name}\``)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          }),
      ],
    });
  },
};
