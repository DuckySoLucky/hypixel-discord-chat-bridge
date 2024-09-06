const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { writeFileSync, readFileSync } = require("fs");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const { errorMessage } = require("../../Logger.js");

module.exports = {
  name: "verify",
  description: "Connect your Discord account to Minecraft",
  verificationCommand: true,
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, user, bypassChecks = false) => {
    try {
      const linkedData = readFileSync("data/linked.json");
      if (linkedData === undefined) {
        throw new HypixelDiscordChatBridgeError(
          "The linked data file does not exist. Please contact an administrator.",
        );
      }

      const linked = JSON.parse(linkedData);
      if (linked === undefined) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      if (bypassChecks === true && user !== undefined) {
        interaction.user = user;
      }

      if (Object.keys(linked).includes(interaction.user.id) === true) {
        if (bypassChecks === true) {
          delete linked[interaction.user.id];
        } else {
          throw new HypixelDiscordChatBridgeError(
            "You are already linked to a Minecraft account. Please run /unverify first.",
          );
        }
      }

      const username = interaction.options.getString("name");
      const { socialMedia, nickname, uuid } = await hypixelRebornAPI.getPlayer(username);
      if (Object.values(linked).includes(uuid) === true) {
        if (bypassChecks === true) {
          delete linked[Object.keys(linked).find((key) => linked[key] === uuid)];
        } else {
          throw new HypixelDiscordChatBridgeError(
            "This player is already linked to a Discord account. Please contact an administrator.",
          );
        }
      }

      const discordUsername = socialMedia.find((media) => media.id === "DISCORD")?.link;
      if (discordUsername === undefined && bypassChecks !== true) {
        throw new HypixelDiscordChatBridgeError("This player does not have a Discord linked.");
      }

      if (discordUsername?.toLowerCase() != interaction.user.username && bypassChecks !== true) {
        throw new HypixelDiscordChatBridgeError(
          `The player '${nickname}' has linked their Discord account to a different account ('${discordUsername}').`,
        );
      }

      const linkedRole = guild.roles.cache.get(config.verification.verifiedRole);
      if (linkedRole === undefined) {
        throw new HypixelDiscordChatBridgeError("The verified role does not exist. Please contact an administrator.");
      }

      linked[interaction.user.id] = uuid;
      writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));

      const embed = new EmbedBuilder()
        .setColor("4BB543")
        .setAuthor({ name: "Successfully linked!" })
        .setDescription(`${user ? `<@${user.id}>'s` : "Your"} account has been successfully linked to \`${nickname}\``)
        .setFooter({
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        });

      await interaction.editReply({ embeds: [embed], ephemeral: true });

      const updateRolesCommand = require("./updateCommand.js");
      if (updateRolesCommand === undefined) {
        throw new HypixelDiscordChatBridgeError("The update command does not exist. Please contact an administrator.");
      }

      await updateRolesCommand.execute(interaction, user);
    } catch (error) {
      errorMessage(error);
      // eslint-disable-next-line no-ex-assign
      error = error
        .toString()
        .replaceAll("Error: [hypixel-api-reborn] ", "")
        .replaceAll(
          "Unprocessable Entity! For help join our Discord Server https://discord.gg/NSEBNMM",
          "This player does not exist. (Mojang API might be down)",
        );

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        });

      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });

      if (
        error !== "You are already linked to a Minecraft account. Please run /unverify first." &&
        error.includes("linked") === true
      ) {
        const verificationTutorialEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setAuthor({ name: "Link with Hypixel Social Media" })
          .setDescription(
            `**Instructions:**\n1) Use your Minecraft client to connect to Hypixel.\n2) Once connected, and while in the lobby, right click "My Profile" in your hotbar. It is option #2.\n3) Click "Social Media" - this button is to the left of the Redstone block (the Status button).\n4) Click "Discord" - it is the second last option.\n5) Paste your Discord username into chat and hit enter. For reference: \`${
              interaction.user.username ?? interaction.user.tag
            }\`\n6) You're done! Wait around 30 seconds and then try again.\n\n**Getting "The URL isn't valid!"?**\nHypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.`,
          )
          .setImage("https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif")
          .setFooter({
            text: `by @kathund. | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png",
          });

        await interaction.followUp({ embeds: [verificationTutorialEmbed], ephemeral: true });
      }
    }
  },
};
