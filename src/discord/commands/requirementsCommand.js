const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const getWeight = require("../../../API/stats/weight.js");
const config = require("../../../config.json");

async function checkRequirements(uuid) {
  const [player, profile] = await Promise.all([hypixel.getPlayer(uuid), getLatestProfile(uuid)]);
  let meetRequirements = false;

  const weightData = getWeight(profile.profile, profile.uuid);
  const weight = weightData?.senither?.total || 0;
  const skyblockLevel = (profile.profile?.leveling?.experience || 0) / 100 ?? 0;

  const bwLevel = player.stats.bedwars.level;
  const bwFKDR = player.stats.bedwars.finalKDRatio;

  const swLevel = player.stats.skywars.level / 5;
  const swKDR = player.stats.skywars.KDRatio;

  const duelsWins = player.stats.duels.wins;
  const dWLR = player.stats.duels.WLRatio;

  if (
    weight >= config.minecraft.guildRequirements.requirements.senitherWeight &&
    config.minecraft.guildRequirements.requirements.senitherWeight > 0
  ) {
    meetRequirements = true;
  }

  if (
    skyblockLevel >= config.minecraft.guildRequirements.requirements.skyblockLevel &&
    config.minecraft.guildRequirements.requirements.skyblockLevel > 0
  ) {
    meetRequirements = true;
  }

  if (
    bwLevel >= config.minecraft.guildRequirements.requirements.bedwarsStars &&
    config.minecraft.guildRequirements.requirements.bedwarsStars > 0
  ) {
    meetRequirements = true;
  }
  if (
    bwFKDR >= config.minecraft.guildRequirements.requirements.bedwarsFKDR &&
    config.minecraft.guildRequirements.requirements.bedwarsFKDR > 0
  ) {
    meetRequirements = true;
  }

  if (
    swLevel >= config.minecraft.guildRequirements.requirements.skywarsStars &&
    config.minecraft.guildRequirements.requirements.skywarsStars > 0
  ) {
    meetRequirements = true;
  }

  if (
    swKDR >= config.minecraft.guildRequirements.requirements.skywarsKDR &&
    config.minecraft.guildRequirements.requirements.skywarsKDR > 0
  ) {
    meetRequirements = true;
  }

  if (
    duelsWins >= config.minecraft.guildRequirements.requirements.duelsWins &&
    config.minecraft.guildRequirements.requirements.duelsWins > 0
  ) {
    meetRequirements = true;
  }

  if (
    dWLR >= config.minecraft.guildRequirements.requirements.duelsWLR &&
    config.minecraft.guildRequirements.requirements.duelsWLR > 0
  ) {
    meetRequirements = true;
  }

  return {
    meetRequirements,
    level: player.level,
    nickname: player.nickname,
    weight: weight.toLocaleString(),
    skyblockLevel: skyblockLevel.toLocaleString(),
    bwLevel: bwLevel.toLocaleString(),
    bwFKDR: bwFKDR.toLocaleString(),
    swLevel: swLevel.toLocaleString(),
    swKDR: swKDR.toLocaleString(),
    duelsWins: duelsWins.toLocaleString(),
    dWLR: dWLR.toLocaleString(),
  };
}

function generateEmbed(data) {
  return new EmbedBuilder()
    .setColor(data.meetRequirements ? 2067276 : 15548997)
    .setTitle(
      `${data.nickname} **${data.meetRequirements ? "has" : "hasn't"}** got the requirements to join the Guild!`,
    )
    .addFields(
      {
        name: "Bedwars Level",
        value: `${data.bwLevel}/${config.minecraft.guildRequirements.requirements.bedwarsStars.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Skywars Level",
        value: `${data.swLevel}/${config.minecraft.guildRequirements.requirements.skywarsStars.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Duels Wins",
        value: `${data.duelsWins}/${config.minecraft.guildRequirements.requirements.duelsWins.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Bedwars FKDR",
        value: `${data.bwFKDR}/${config.minecraft.guildRequirements.requirements.bedwarsFKDR.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Skywars KDR",
        value: `${data.swKDR}/${config.minecraft.guildRequirements.requirements.skywarsKDR.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Duels WLR",
        value: `${data.dWLR}/${config.minecraft.guildRequirements.requirements.duelsWLR.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Senither Weight",
        value: `${data.weight}/${config.minecraft.guildRequirements.requirements.senitherWeight.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Skyblock Level",
        value: `${data.skyblockLevel}/${config.minecraft.guildRequirements.requirements.skyblockLevel.toLocaleString()}`,
        inline: true,
      },
    )
    .setThumbnail(`https://www.mc-heads.net/avatar/${data.nickname}`)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });
}

module.exports = {
  checkRequirements,
  generateEmbed,
  name: "requirements",
  description: "Checks a user's requirements to join the guild.",
  options: [
    {
      name: "username",
      description: "minecraft username",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const name = interaction.options.getString("username") || interaction?.member?.nickname || null;
    if (name === null) throw new HypixelDiscordChatBridgeError("Please input a username");
    const playerInfo = await checkRequirements(await getUUID(name));
    const embed = generateEmbed(playerInfo);
    await interaction.followup({ embeds: [embed] });
  },
};
