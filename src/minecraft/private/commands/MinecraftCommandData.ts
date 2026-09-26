import type MinecraftCommandDataOption from "./MinecraftCommandDataOption.js";
import type { CommandDataJSON } from "../../../types/minecraft.js";
import type { DevName } from "../../../types/application.js";

class MinecraftCommandData {
  #name: string = "";
  #description: string = "";
  #aliases: string[] = [];
  #options: MinecraftCommandDataOption[] = [];
  #authors: DevName[] = ["DuckySoLucky"];

  setName(name: string): this {
    this.#name = name;
    return this;
  }

  get name(): string {
    return this.#name;
  }

  setDescription(description: string): this {
    this.#description = description;
    return this;
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
    this.#options = [...options];
    return this;
  }

  get options(): MinecraftCommandDataOption[] {
    return [...this.#options];
  }

  setAuthors(names: DevName[]): this {
    this.#authors = [...names];
    return this;
  }

  get authors(): DevName[] {
    return this.#authors;
  }

  toJSON(): CommandDataJSON {
    return { name: this.name, description: this.description, aliases: this.aliases, options: this.options.map((option) => option.toJSON()), authors: this.authors };
  }
}

export default MinecraftCommandData;
