const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const axios = require("axios");
const AuthProvider = require("../AuthProvider.js");

module.exports = {
  name: "scf-whoami",
  description: "Returns user permission info.",

  execute: async (interaction) => {
    const user = interaction.member;

    let perm_data = undefined;

    const AuthData = new AuthProvider();
    perm_data = await AuthData.permissionInfo(user);

    let perm_info = {
      0: "Member",
      1: "SBU Moderator",
      2: "SCF Moderator",
      3: "SBU Admin",
      4: "SCF Admin",
      5: "SCF Guild Master"
    };

    let player_role = perm_info?.[perm_data?.level] ?? "Member";
    let permissions = JSON.stringify(perm_data?.permissions ?? {});
    let team = perm_data?.team ?? "None";

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Whoami" })
      .setDescription(`User permission info:\nPlatform Auth Provider: \`${perm_data?.provider ?? "None"}\`\nUser role: \`${player_role}\`\nUser team: \`${team}\`\nUser permissions: \`\`\`${permissions}\`\`\``)
      .setFooter({
        text: "/help for more info",
        iconURL: config.minecraft.API.SCF.logo,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
