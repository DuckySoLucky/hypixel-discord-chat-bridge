import type CommandDataOption from "./CommandDataOption.js";
import type { CommandDataJSON } from "../../Types/Minecraft.js";

class CommandData {
  private name: string = "";
  private description: string | null = null;
  private aliases: string[] = [];
  private options: CommandDataOption[] = [];

  setName(name: string): this {
    this.name = name;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setDescription(description: string | null): this {
    this.description = description;
    return this;
  }

  getDescription(): string | null {
    return this.description;
  }

  setAliases(aliases: string[]): this {
    this.aliases = aliases;
    return this;
  }

  getAliases(): string[] {
    return this.aliases;
  }

  setOptions(options: CommandDataOption[]): this {
    this.options = options;
    return this;
  }

  getOptions(): CommandDataOption[] {
    return this.options;
  }

  toJSON(): CommandDataJSON {
    return { name: this.getName(), description: this.getDescription(), aliases: this.getAliases(), options: this.getOptions().map((option) => option.toJSON()) };
  }
}

export default CommandData;
