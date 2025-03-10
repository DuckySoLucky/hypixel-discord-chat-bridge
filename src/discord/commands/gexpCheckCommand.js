const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { Embed, SuccessEmbed } = require("../../contracts/embedHandler.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const { writeFileSync, readFileSync } = require("fs");

module.exports = {
  name: "gexpcheck",
  description: "Shows everything under an set amount of gexp",
  inactivityCommand: true,
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      type: 4,
      name: "amount",
      description: "Members below this GEXP number",
      min_value: 1,
      required: true
    }
  ],

  execute: async (interaction) => {
    const amount = interaction.options.getInteger("amount");
    await interaction.deferReply();

    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData);
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const inactivityData = readFileSync("data/inactivity.json");
    if (!inactivityData) {
      throw new HypixelDiscordChatBridgeError("The inactivity data file does not exist. Please contact an administrator.");
    }

    const inactivity = JSON.parse(inactivityData);
    if (!inactivity) {
      throw new HypixelDiscordChatBridgeError("The inactivity data file is malformed. Please contact an administrator.");
    }

    let gexpString = "";
    let skippedString = "";
    let inactiveString = "";
    let membersAboveGexpString = "";
    const { members } = await hypixelRebornAPI.getGuild("player", bot.username);
    const sorted = members.sort((a, b) => b.weeklyExperience - a.weeklyExperience);
    for (const member of sorted) {
      const position = members.indexOf(member) + 1;
      const progress = ((position / members.length) * 100).toFixed(2);

      const progressEmbed = new Embed()
        .setAuthor({ name: "Weekly Guild Experience Leaderboard" })
        .setDescription(`**Progress:** \`${progress}%\` (\`${position}/${members.length}\`)`)
        .setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

      await interaction.editReply({ embeds: [progressEmbed] });

      const username = await getUsername(member.uuid);
      const linkedUser = Object.keys(linked).find((key) => linked[key] === member.uuid);
      if (linkedUser === undefined) {
        skippedString += `${username} » User not verified | ${member.weeklyExperience.toLocaleString()}\n`;
        continue;
      }

      const inactive = Object.keys(inactivity).find((key) => inactivity[key].uuid === member.uuid);
      if (inactive) {
        inactiveString += `${username} » Member Inactive | ${inactivity[inactive].reason}`;
        continue;
      }

      if (member.weeklyExperience >= amount) {
        membersAboveGexpString += `${username} » Above gexp requirement | ${member.weeklyExperience.toLocaleString()}\n`;
        continue;
      }

      gexpString += `${username} » ${member.weeklyExperience.toLocaleString()}\n`;
    }

    skippedString += `\n\nInactive Members\n${inactiveString}\n\nUsers Above Gexp Requirement\n${membersAboveGexpString}`;
    writeFileSync("data/guildExperience.txt", gexpString);
    writeFileSync("data/guildExperienceSkipped.txt", skippedString);

    const finalEmbed = new SuccessEmbed("Weekly Guild Experience Leaderboard").setFooter({
      text: `by @.kathund | /help [command] for more information`,
      iconURL: "https://i.imgur.com/uUuZx2E.png"
    });

    await interaction.editReply({ embeds: [finalEmbed], files: ["data/guildExperience.txt", "data/guildExperienceSkipped.txt"] });
  }
};
