import config from "../../../config.json" with { type: "json" };
import { type APIEmbed, type ColorResolvable, EmbedBuilder, type EmbedData } from "discord.js";
import { CommonDevs } from "../../private/constants.js";
import { ConfigOtherColors } from "../../types/config.js";
import { translate } from "../../translations/TranslationsManager.js";
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
    const devData = CommonDevs[dev];
    this.setFooter({ text: translate("discord.embed.generic.footer.dev", devData), iconURL: devData.iconURL });
    return this;
  }

  setType(type: "Warning" | "Error" | "Success") {
    if (type === "Warning") this.setColor("Yellow");
    if (type === "Error") this.setColor("Red");
    if (type === "Success") this.setColor("Green");
    this.setAuthor({ name: translate(`discord.embed.generic.author.${type}`) });
  }
}

export class WarningEmbed extends Embed {
  constructor() {
    super();
    this.setType("Warning");
  }
}

export class ErrorEmbed extends Embed {
  constructor() {
    super();
    this.setType("Error");
  }
}

export class SuccessEmbed extends Embed {
  constructor() {
    super();
    this.setType("Success");
  }
}
