import "i18next";
import type Translations from "../../resources/locales/en_us.json";

declare module "i18next" {
  interface CustomTypeOptions {
    enableSelector: true;
    defaultNS: "en";
    resources: { en: typeof Translations };
  }
}

// eslint-disable-next-line import/prefer-default-export
export enum ApplicationLanguages {
  English = "en"
}
