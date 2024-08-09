const { EmbedBuilder } = require("discord.js");

/**
 * Constructs a new instance of the class.
 * @param {number|string} color - The color of the embed
 * @param {string} title - The title of the embed.
 * @param {string} description - The description of the embed.
 * @param {string} footer - The footer of the embed.
 */
class Embed extends EmbedBuilder {
  constructor(color = 3447003, title, description, footer) {
    super();

    this.setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

    if (color) {
      this.setColor(color);
    }

    if (title) {
      this.setAuthor({ name: title });
    }

    if (description) {
      this.setDescription(description);
    }

    if (footer) {
      this.setFooter(footer);
    }
  }
}

/**
 * SuccessEmbed class for success messages.
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
   * @param {string} footer - The footer of the success.
   */
  constructor(description, footer) {
    super();

    this.setAuthor({ name: "Success" });
    this.setColor(5763719);

    if (footer) this.setFooter(footer);

    this.setDescription(description);

    if (footer) {
      this.setFooter(footer);
    }
  }
}

module.exports = {
  Embed,
  ErrorEmbed,
  SuccessEmbed,
};
