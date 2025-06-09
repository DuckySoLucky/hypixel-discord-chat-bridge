const { Embed, ErrorEmbed, SuccessEmbed } = require("../../contracts/embedHandler.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { formatError } = require("../../contracts/helperFunctions.js");
const updateRolesCommand = require("./updateCommand.js");
const { writeFileSync, readFileSync } = require("fs");
const config = require("../../../config.json");

module.exports = {
  name: "verify",
  description: "Connect your Discord account to Minecraft",
  verificationCommand: true,
  requiresBot: true,
  options: [
    {
      name: "username",
      description: "Minecraft Username",
      type: 3,
      required: true
    }
  ],

  execute: async (interaction, extra = {}) => {
    try {
      const linkedData = readFileSync("data/linked.json");
      if (!linkedData) {
        throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
      }

      const linked = JSON.parse(linkedData.toString("utf8"));
      if (!linked) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      const linkedRole = guild.roles.cache.get(config.verification.roles.verified.roleId);
      if (!linkedRole) {
        throw new HypixelDiscordChatBridgeError("The verified role does not exist. Please contact an administrator.");
      }

      const username = interaction.options.getString("username");
      const { socialMedia, nickname, uuid } = await hypixelRebornAPI.getPlayer(username);

      const discordUsername = socialMedia.find((media) => media.id === "DISCORD")?.link;
      if (!discordUsername) {
        throw new HypixelDiscordChatBridgeError(`The player '${nickname}' has not linked their Discord account. Please follow the instructions below.`);
      }

      if (discordUsername.toLowerCase() !== interaction.user.username) {
        throw new HypixelDiscordChatBridgeError(
          `The player '${nickname}' has linked their Discord account to a different account ('${discordUsername}'). Please follow the instructions below.`
        );
      }

      if (linked[uuid] !== undefined) throw new HypixelDiscordChatBridgeError(`The player '${nickname}' is already linked please /unverify first.`);

      const linkedUser = Object.entries(linked).find(([, value]) => value === interaction.user.id)?.[0];
      if (linkedUser) {
        throw new HypixelDiscordChatBridgeError(`You are already verified. Please run /unverify to continue.`);
      }

      linked[uuid] = interaction.user.id;
      writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));

      const embed = new SuccessEmbed(`${extra.user ? `<@${extra.user.id}>'s` : "Your"} account has been successfully linked to \`${nickname}\``)
        .setAuthor({ name: "Successfully linked!" })
        .setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

      await interaction.editReply({ embeds: [embed], ephemeral: true });

      await updateRolesCommand.execute(interaction);
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-ex-assign
      error = formatError(error);

      const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
      if (error.includes("Please follow the instructions below.")) {
        const verificationTutorialEmbed = new Embed()
          .setAuthor({ name: "Link with Hypixel Social Media" })
          .setDescription(
            `**Instructions:**\n1) Use your Minecraft client to connect to Hypixel.\n2) Once connected, and while in the lobby, right click "My Profile" in your hotbar. It is option #2.\n3) Click "Social Media" - this button is to the left of the Redstone block (the Status button).\n4) Click "Discord" - it is the second last option.\n5) Paste your Discord username into chat and hit enter. For reference: \`${interaction.user.username ?? interaction.user.tag}\`\n6) You're done! Wait around 30 seconds and then try again.\n\n**Getting "The URL isn't valid!"?**\nHypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.`
          )
          .setImage("https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif")
          .setFooter({
            text: `by @.kathund | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png"
          });

        await interaction.followUp({ embeds: [verificationTutorialEmbed], ephemeral: true });
      }
    }
  }
};
