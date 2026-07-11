import { translate } from "../../../translations/TranslationsManager.js";
import type MinecraftCommandDataOption from "./MinecraftCommandDataOption.js";
import type { CommandDataJSON } from "../../../types/minecraft.js";
import type { ParseKeys } from "i18next";

class MinecraftCommandData {
  #id: string = "";
  #name: string = "";
  #description: string = "";
  #aliases: string[] = [];
  #options: MinecraftCommandDataOption[] = [];

  setName(name: string): this {
    this.#id = name;
    this.#name = translate(`minecraft.commands.${name}.name` as ParseKeys);
    this.#description = translate(`minecraft.commands.${name}.description` as ParseKeys);
    return this;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  setAliases(aliases: string[]): this {
    this.#aliases = [...aliases];
    return this;
  }

  get aliases(): string[] {
    return [...this.#aliases];
  }

  setOptions(options: MinecraftCommandDataOption[]): this {
    const prefixes = [`minecraft.commands.${this.#id}.options`, "minecraft.commands.generic.options"];
    this.#options = options.map((option) => {
      for (const prefix of prefixes) if (option.setData(prefix)) break;
      return option;
    });
    return this;
  }

  get options(): MinecraftCommandDataOption[] {
    return [...this.#options];
  }

  toJSON(): CommandDataJSON {
    return { name: this.name, description: this.description, aliases: this.aliases, options: this.options.map((option) => option.toJSON()) };
  }
}

export default MinecraftCommandData;
