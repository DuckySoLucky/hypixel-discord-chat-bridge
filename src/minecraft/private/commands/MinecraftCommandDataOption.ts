import type { CommandDataOptionJSON } from "../../../types/minecraft.js";

class MinecraftCommandDataOption {
  #name: string = "";
  #description: string | null = null;
  #required: boolean = false;

  setName(name: string): this {
    this.#name = name;
    return this;
  }

  get name(): string {
    return this.#name;
  }

  setDescription(description: string | null): this {
    this.#description = description;
    return this;
  }

  get description(): string | null {
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
    return { name: this.name, description: this.description, required: this.required };
  }
}

export default MinecraftCommandDataOption;
