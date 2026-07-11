import { translate } from "../../../translations/TranslationsManager.js";
import type { CommandDataOptionJSON } from "../../../types/minecraft.js";
import type { ParseKeys } from "i18next";

class MinecraftCommandDataOption {
  #key: string = "";
  #name: string = "";
  #description: string = "";
  #required: boolean = false;

  setData(prefix: string): boolean {
    const name = translate(`${prefix}.${this.#key}.name` as ParseKeys);
    const description = translate(`${prefix}.${this.#key}.description` as ParseKeys);
    const found = name !== `${prefix}.${this.#key}.name` && description !== `${prefix}.${this.#key}.description`;
    if (!found) return false;
    this.#name = name;
    this.#description = description;
    return true;
  }

  get key(): string {
    return this.#key;
  }

  setName(name: string): this {
    this.#key = name;
    return this;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  setRequired(required: boolean): this {
    this.#required = required;
    return this;
  }

  get required(): boolean {
    return this.#required;
  }

  toJSON(): CommandDataOptionJSON {
    return { name: this.#name, description: this.#description, required: this.#required };
  }
}

export default MinecraftCommandDataOption;
