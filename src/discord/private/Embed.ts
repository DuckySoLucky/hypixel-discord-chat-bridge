import config from "../../../config.json" with { type: "json" };
import { type APIEmbed, type ColorResolvable, EmbedBuilder, type EmbedData } from "discord.js";
import { CommonDevs } from "../../private/constants.js";
import { ConfigOtherColors } from "../../types/config.js";
import type { Devs } from "../../types/misc.js";

export default class Embed extends EmbedBuilder {
  constructor(data?: EmbedData | APIEmbed) {
    super(data);
    if (data) return;
    this.setTimestamp();
    this.setColor("Blue");
    this.setDevFooter("DuckySoLucky");
  }

  override setColor(color: ConfigOtherColors | ColorResolvable): this {
    if (ConfigOtherColors.safeParse(color).success) return super.setColor(config.other.colors[color as ConfigOtherColors] as ColorResolvable);
    return super.setColor(color as ColorResolvable);
  }

  setDevFooter(dev: Devs): this {
    const { username, iconURL } = CommonDevs[dev];
    this.setFooter({ text: `by @${username} | /help [command] for more information`, iconURL });
    return this;
  }
}

export class WarningEmbed extends Embed {
  constructor() {
    super();
    this.setColor("Yellow");
    this.setAuthor({ name: "An Warning has occurred" });
  }
}

export class ErrorEmbed extends Embed {
  constructor() {
    super();
    this.setColor("Red");
    this.setAuthor({ name: "An Error has occurred" });
  }
}

export class SuccessEmbed extends Embed {
  constructor() {
    super();
    this.setColor("Green");
    this.setAuthor({ name: "Success" });
  }
}
