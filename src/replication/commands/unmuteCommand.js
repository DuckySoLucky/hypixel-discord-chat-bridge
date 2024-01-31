const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const AuthProvider = require("../AuthProvider.js");

module.exports = {
  name: "scf-unmute",
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
    const executor_id = user.id;
    const permission_required = 'unmute';

    let permission = false;

    const AuthData = new AuthProvider();
    permission = (await AuthData.permissionInfo(user)).permissions?.[permission_required] ?? false;

    if (!permission) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command, or the Permission API is Down.");
    }

    const name = interaction.options.getString("name");
    bot.chat(`/g unmute ${name}`);

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Unmute" })
      .setDescription(`Successfully executed \`/g unmute ${name}\``)
      .setFooter({
        text: "/help [command] for more information",
        iconURL: config.minecraft.API.SCF.logo,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
