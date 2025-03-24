const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { Embed, SuccessEmbed } = require("../../contracts/embedHandler.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const { writeFileSync, readFileSync } = require("fs");
const config = require("../../../config.json");
const ms = require("ms");

function removeExpiredInactivity() {
  const inactivityData = readFileSync("data/inactivity.json");
  if (!inactivityData) {
    throw new Error("The inactivity data file does not exist. Please contact an administrator.");
  }

  const inactivity = JSON.parse(inactivityData);
  if (!inactivity) {
    throw new Error("The inactivity data file is malformed. Please contact an administrator.");
  }

  const time = Math.floor(new Date().getTime() / 1000);

  Object.entries(inactivity).forEach((inactivityData) => {
    if (time >= inactivityData[1].expire) delete inactivity[inactivityData[0]];
  });
  writeFileSync("data/inactivity.json", JSON.stringify(inactivity, null, 2));
}

module.exports = {
  name: "inactivity",
  description: "Send an inactivity notice to the guild staff",
  inactivityCommand: true,
  guildOnly: true,
  linkedOnly: true,
  verifiedOnly: true,
  removeExpiredInactivity,
  options: [
    {
      name: "time",
      description: "The time you are inactive for. (eg 2d, 2w)",
      type: 3,
      required: true
    },
    {
      name: "reason",
      description: "The reason you are going away",
      type: 3,
      required: false
    }
  ],

  execute: async (interaction) => {
    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linke data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData.toString());
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const uuid = Object.entries(linked).find(([, value]) => value === interaction.user.id)?.[0];
    if (!uuid) {
      throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
    }
    const username = await getUsername(uuid);

    const inactivityData = readFileSync("data/inactivity.json");
    if (!inactivityData) {
      throw new HypixelDiscordChatBridgeError("The inactivity data file does not exist. Please contact an administrator.");
    }

    const inactivity = JSON.parse(inactivityData);
    if (!inactivity) {
      throw new HypixelDiscordChatBridgeError("The inactivity data file is malformed. Please contact an administrator.");
    }

    if (inactivity[uuid]) {
      const embed = new Embed()
        .setTitle("Inactivity Failed")
        .setDescription(`You are already inactive until <t:${inactivity[uuid].expire}:F> (<t:${inactivity[uuid].expire}:R>)`)
        .setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });
      return await interaction.followUp({ embeds: [embed] });
    }

    const time = Math.floor(ms(interaction.options.getString("time")) / 1000);
    if (isNaN(time)) throw new HypixelDiscordChatBridgeError("Please input a valid time");

    if (time > config.verification.inactivity.maxInactivityTime * 86400) {
      throw new HypixelDiscordChatBridgeError(
        `You can only request inactivity for ${config.verification.inactivity.maxInactivityTime} day(s) or less. Please contact an administrator if you need more time.`
      );
    }

    const reason = interaction.options.getString("reason") || "None";
    const expire = Math.floor(Date.now() / 1000) + time;
    const date = Math.floor(new Date().getTime() / 1000);
    if (date > expire) throw new HypixelDiscordChatBridgeError("Time can't be in the past");
    const inactivityEmbed = new Embed()
      .setTitle("Inactivity Request")
      .setDescription(
        `\`User:\` <@${interaction.user.id}>\n\`Username:\` ${username}\n\`Requested:\` <t:${date}:F> (<t:${date}:R>)\n\`Expiration:\` <t:${expire}:F> (<t:${expire}:R>)\n\`Reason:\` ${reason}`
      )
      .setThumbnail(`https://www.mc-heads.net/avatar/${username}`)
      .setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

    const channel = interaction.client.channels.cache.get(config.verification.inactivity.channel);
    if (channel === undefined) {
      throw new HypixelDiscordChatBridgeError("Inactivity channel not found. Please contact an administrator.");
    }

    inactivity[uuid] = { id: interaction.user.id, reason, expire };
    writeFileSync("data/inactivity.json", JSON.stringify(inactivity, null, 2));
    await channel.send({ embeds: [inactivityEmbed] });
    const inactivityResponse = new SuccessEmbed(`Inactivity request has been successfully sent to the guild staff.`).setFooter({
      text: `by @.kathund | /help [command] for more information`,
      iconURL: "https://i.imgur.com/uUuZx2E.png"
    });
    await interaction.followUp({ embeds: [inactivityResponse] });
  }
};
