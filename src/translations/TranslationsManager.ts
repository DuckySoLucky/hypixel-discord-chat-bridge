import { ApplicationLanguages } from "../types/translations.js";
import { type ParseKeys, createInstance, type i18n } from "i18next";

import English from "../../resources/locales/en_us.json" with { type: "json" };

export default class TranslationsManager {
  readonly instance: i18n;
  constructor() {
    this.instance = createInstance({
      load: "all",
      saveMissing: true,
      interpolation: { escapeValue: false },
      fallbackLng: ApplicationLanguages.English,
      resources: { [ApplicationLanguages.English]: { translation: English } }
    });
    this.init();
  }

  private async init() {
    await this.instance.init();
  }
}

export const translations = new TranslationsManager();

export function translate(key: ParseKeys, replaces: Record<string, any> = {}): string {
  return translations.instance.t(key as any, replaces).toString();
}
