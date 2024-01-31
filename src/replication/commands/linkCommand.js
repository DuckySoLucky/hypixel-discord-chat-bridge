const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const axios = require("axios");
const AuthProvider = require("../AuthProvider.js");

module.exports = {
  name: "scf-link",
  description: "Links the correct user account for the bridge.",
  options: [
    {
      name: "nick",
      description: "Minecraft nick.",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;

    const minecraft_nick = interaction.options.getString("nick");

    let data = await Promise.all([
      axios.get(
        `https://sky.dssoftware.ru/api.php?method=saveLinked&discord_id=${user.id}&nick=${minecraft_nick}&api=${config.minecraft.API.SCF.key}&tag=${user.user.username}`
      ),
    ]).catch((error) => {
      console.log(error);
      throw new HypixelDiscordChatBridgeError("Failed to connect to API. Let admins know, or try again later.");
    });

    let result = data[0].data ?? {};

    if((result?.response ?? "FAULT") == "FAULT"){
      throw new HypixelDiscordChatBridgeError(result?.info ?? "Failed to connect to API.");
    }

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Successfully linked" })
      .setDescription(`Now you will send messages as \`${minecraft_nick}\`.`)
      .setFooter({
        text: "/help for more info",
        iconURL: config.minecraft.API.SCF.logo,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};