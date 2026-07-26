class ExtensionRegistrationError extends Error {
  constructor(
    readonly source: string,
    message: string
  ) {
    super(`${source}: ${message}`);
    this.name = "ExtensionRegistrationError";
  }
}

class ExtensionRegistry<Extension> {
  readonly #extensions = new Map<string, Extension>();
  readonly #aliases = new Map<string, string>();

  register(id: string, extension: Extension, aliases: readonly string[] = [], source: string = "programmatic"): void {
    const normalizedId = this.normalize(id);
    if (!normalizedId) throw new ExtensionRegistrationError(source, "Extension identifier cannot be empty.");
    this.assertAvailable(normalizedId, source);

    const normalizedAliases = aliases.map((alias) => this.normalize(alias));
    const seenAliases = new Set<string>();
    for (const alias of normalizedAliases) {
      if (!alias) throw new ExtensionRegistrationError(source, `Extension "${normalizedId}" has an empty alias.`);
      if (alias === normalizedId || seenAliases.has(alias)) throw new ExtensionRegistrationError(source, `Duplicate extension alias: ${alias}`);
      this.assertAvailable(alias, source);
      seenAliases.add(alias);
    }

    this.#extensions.set(normalizedId, extension);
    for (const alias of normalizedAliases) this.#aliases.set(alias, normalizedId);
  }

  unregister(id: string): boolean {
    const normalizedId = this.#aliases.get(this.normalize(id)) ?? this.normalize(id);
    if (!this.#extensions.delete(normalizedId)) return false;
    for (const [alias, target] of this.#aliases) {
      if (target === normalizedId) this.#aliases.delete(alias);
    }
    return true;
  }

  get(id: string): Extension | undefined {
    const normalized = this.normalize(id);
    return this.#extensions.get(this.#aliases.get(normalized) ?? normalized);
  }

  has(id: string): boolean {
    return this.get(id) !== undefined;
  }

  clear(): void {
    this.#extensions.clear();
    this.#aliases.clear();
  }

  values(): readonly Extension[] {
    return [...this.#extensions.values()];
  }

  entries(): readonly (readonly [string, Extension])[] {
    return [...this.#extensions.entries()];
  }

  get size(): number {
    return this.#extensions.size;
  }

  private assertAvailable(id: string, source: string): void {
    if (this.#extensions.has(id) || this.#aliases.has(id)) throw new ExtensionRegistrationError(source, `Duplicate extension identifier: ${id}`);
  }

  private normalize(id: string): string {
    return id.trim().toLowerCase();
  }
}

export { ExtensionRegistrationError };
export default ExtensionRegistry;
