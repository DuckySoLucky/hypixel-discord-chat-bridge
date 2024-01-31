
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const axios = require("axios");
const AuthProvider = require("../AuthProvider.js");

module.exports = {
  name: "scf-permission",
  description: "Changes user permission level.",
  options: [
    {
      name: "user",
      description: "User to change permission level of.",
      type: 6,
      required: true,
    },
    {
      name: "level",
      description: "Permission level of the user.",
      type: 3,
      required: true,
      choices: [
        {
          name: "SCF Admin",
          value: "4",
        },
        {
          name: "SBU Admin",
          value: "3",
        },
        {
          name: "SCF Moderator",
          value: "2",
        },
        {
          name: "SBU Moderator",
          value: "1",
        },
        {
          name: "Member",
          value: "0",
        },
        {
            name: "Reset",
            value: "-1",
        },
      ],
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    const executor_id = user.id;
    const permission_required = 'manage_roles';

    let permission = false;

    const AuthData = new AuthProvider();
    const executorData = await AuthData.permissionInfo(user);
    permission = executorData.permissions?.[permission_required] ?? false;

    if (!permission) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command, or the Permission API is Down.");
    }
    const discord_user = interaction.options.getUser("user").id;
    const level = parseInt(interaction.options.getString("level"));

    if(level >= executorData.level){
      throw new HypixelDiscordChatBridgeError("You cannot promote to level higher than yours.");
    }

    let team = (level % 2) == 1 ? "SBU" : "SCF";

    let give_role = await Promise.all([
      axios.get(
        `https://sky.dssoftware.ru/api.php?method=setPermissionLevel&discord_id=${discord_user}&team=${team}&level=${level}&api=${config.minecraft.API.SCF.key}&executed_by=${executor_id}`
      ),
    ]).catch((error) => {});

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Permission Level" })
      .setDescription(`Successfully changed the permission level of <@${discord_user}> (${level}).`)
      .setFooter({
        text: "/help for more info",
        iconURL: config.minecraft.API.SCF.logo,
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};