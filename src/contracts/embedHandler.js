const { EmbedBuilder } = require("discord.js");

/**
 * Constructs a new instance of the class.
 * @param {number|string} color - The color of the embed
 * @param {string} title - The title of the embed.
 * @param {string} description - The description of the embed.
 */
class Embed extends EmbedBuilder {
  constructor() {
    super();

    this.setColor(3447003);
    this.setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png"
    });
  }
}

/**
 * ErrorEmbed class for success messages.
 * @extends {Embed}
 */
class ErrorEmbed extends Embed {
  /**
   * Constructs a new ErrorEmbed instance.
   * @param {string} description - The description of the error.
   */
  constructor(description) {
    super();

    this.setAuthor({ name: "An Error has occurred" });
    this.setColor(15548997);
    this.setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png"
    });

    this.setDescription(description);
  }
}

/**
 * SuccessEmbed class for success messages.
 * @extends {Embed}
 */
class SuccessEmbed extends Embed {
  /**
   * Constructs a new SuccessEmbed instance.
   * @param {string} description - The description of the success.
   */
  constructor(description) {
    super();

    this.setAuthor({ name: "Success" });
    this.setColor(5763719);
    this.setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png"
    });

    this.setDescription(description);
  }
}

module.exports = {
  Embed,
  ErrorEmbed,
  SuccessEmbed
};
