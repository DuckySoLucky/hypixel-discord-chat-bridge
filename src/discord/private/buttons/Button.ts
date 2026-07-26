import { ButtonBuilder } from "discord.js";
import { translate } from "../../../translations/TranslationsManager.js";
import type { ParseKeys } from "i18next";

export default class Button extends ButtonBuilder {
  override setCustomId(customId: string): this {
    super.setCustomId(customId);
    super.setLabel(translate(`discord.buttons.${customId}.label` as ParseKeys));
    return this;
  }
}
