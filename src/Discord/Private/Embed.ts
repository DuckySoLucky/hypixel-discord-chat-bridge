import { CommonDevs } from "../../Private/Constants.js";
import { EmbedBuilder } from "discord.js";
import type { CommonDev } from "../../Types/Misc.js";

export class BasicEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setColor(3447003);
    this.setTimestamp();
  }

  setDevFooter(dev: CommonDev): this {
    const { username, iconURL } = CommonDevs[dev];
    this.setFooter({ text: `by @${username} | /help [command] for more information`, iconURL });
    return this;
  }
}

export default class Embed extends BasicEmbed {
  constructor() {
    super();
    this.setTimestamp();
    this.setColor(3447003);
    this.setDevFooter("DuckySoLucky");
  }
}

export class ErrorEmbed extends Embed {
  constructor(description: string | null = null) {
    super();
    this.setColor(15548997);
    this.setDescription(description);
    this.setAuthor({ name: "An Error has occurred" });
  }
}

export class SuccessEmbed extends Embed {
  constructor(description: string | null = null) {
    super();
    this.setColor(5763719);
    this.setDescription(description);
    this.setAuthor({ name: "Success" });
  }
}
