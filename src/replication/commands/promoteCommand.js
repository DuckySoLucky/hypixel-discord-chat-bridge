const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const AuthProvider = require("../AuthProvider.js");

module.exports = {
  name: "scf-promote",
  description: "Promotes the given user by one guild rank.",
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
    const permission_required = 'mc_promote';

    let permission = false;

    const AuthData = new AuthProvider();
    permission = (await AuthData.permissionInfo(user)).permissions?.[permission_required] ?? false;

    if (!permission) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command, or the Permission API is Down.");
    }

    const name = interaction.options.getString("name");
    bot.chat(`/g promote ${name}`);

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Promote" })
      .setDescription(`Successfully executed \`/g promote ${name}\``)
      .setFooter({
        text: "/help [command] for more information",
        iconURL: config.minecraft.API.SCF.logo,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
