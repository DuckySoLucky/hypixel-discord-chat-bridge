const { getPlayerVariableStats } = require("../../contracts/getVariableStats.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { titleCaseCamel } = require("../../contracts/helperFunctions.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { Embed } = require("../../contracts/embedHandler.js");
const { SlashCommandBuilder } = require("discord.js");
const config = require("../../../config.json");

/**
 * Check a player's requirements for the guild
 * @param {string} uuid
 * @returns {Promise<import("../../../types/requirements.js").Requirements>}
 */
async function checkRequirements(uuid) {
  const stats = await getPlayerVariableStats(uuid);
  const { requirements: configRequirements, requiredToHave } = config.minecraft.guildRequirements;

  /** @type {import("../../../types/requirements.js").Requirement[]} */
  const requirements = Object.entries(configRequirements).map(([key, required]) => {
    const has = stats[key] ?? 0;
    return { key, required, has, passed: has >= required };
  });

  const requirementsPassed = requirements.filter((requirement) => requirement.passed).length;
  const passed = requirementsPassed >= requiredToHave;

  return { username: stats.username, uuid, guildName: stats.guildName, passed, requirementsPassed, requirements };
}

/**
 * Generate a requirements embed
 * @param {import("../../../types/requirements.js").Requirements} data
 * @returns {Embed}
 */
function generateEmbed(data) {
  return new Embed()
    .setColor(data.passed ? 2067276 : 15548997)
    .setTitle(`${data.username} **${data.passed ? "has" : "hasn't"}** got the requirements to join ${data.guildName}!`)
    .setDescription(
      `${data.username} meets **${data.requirementsPassed} requirement(s)** out of the required **${config.minecraft.guildRequirements.requiredToHave} requirement(s)** needed to join ${data.guildName}`
    )
    .addFields(
      data.requirements.map(({ key, has, required, passed }) => ({
        name: titleCaseCamel(key),
        value: `${passed ? ":white_check_mark:" : ":x:"} ${has}/${required}`,
        inline: true
      }))
    )
    .setThumbnail(`https://www.mc-heads.net/avatar/${data.username}`);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("requirements")
    .setDescription("Check a user's requirements to join the guild")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username")),
  checkRequirements,
  generateEmbed,

  execute: async (interaction) => {
    const username = interaction.options.getString("username") ?? interaction.member?.nickname ?? null;
    if (username === null) throw new HypixelDiscordChatBridgeError("Please input a username");
    const data = await checkRequirements(await getUUID(username));
    const embed = generateEmbed(data);
    await interaction.followUp({ embeds: [embed] });
  }
};
