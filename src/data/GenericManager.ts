import HypixelDiscordChatBridgeError from "../private/error.js";
import { access, readFile, rename, writeFile } from "node:fs/promises";
import type DataManager from "./DataManager.js";
import type GenericData from "./GenericData.js";
import type { Lifecycle } from "../core/Lifecycle.js";
import type { ZodType } from "zod";

abstract class GenericManager<JSONData, Data, ParsedData extends GenericData<JSONData, GenericManager<JSONData, Data, ParsedData>>> implements Lifecycle {
  private initialized?: Promise<void>;
  private writeQueue: Promise<void> = Promise.resolve();
  constructor(
    readonly data: DataManager,
    private readonly filePath: string,
    private readonly name: string,
    private readonly basicData: Data,
    private readonly schema: ZodType<Data>
  ) {}

  start(): Promise<void> {
    this.initialized ??= this.initialize();
    return this.initialized;
  }

  async stop(): Promise<void> {
    await this.writeQueue;
  }

  protected async getFile(): Promise<Data> {
    await this.start();
    const data = await readFile(this.filePath, "utf-8");
    if (!data) throw new HypixelDiscordChatBridgeError(`The ${this.name} data file does not exist. Please contact an administrator.`);
    const parsed: unknown = JSON.parse(data);
    const result = this.schema.safeParse(parsed);
    if (!result.success) throw new HypixelDiscordChatBridgeError(`The ${this.name} data file is malformed: ${result.error.message}`);
    return result.data;
  }

  abstract parseData(data: Data): ParsedData[];
  protected abstract getId(data: ParsedData): string;

  async getFullData(): Promise<ParsedData[]> {
    return this.parseData(await this.getFile());
  }

  writeData(data: Data): Promise<ParsedData[]> {
    return this.enqueueWrite(async () => {
      await this.atomicWrite(data);
      return this.parseData(data);
    });
  }

  protected mutateData(operation: (data: Data) => Data): Promise<ParsedData[]> {
    return this.enqueueWrite(async () => {
      const current = await this.getFile();
      const updated = operation(current);
      const validated = this.schema.parse(updated);
      await this.atomicWrite(validated);
      return this.parseData(validated);
    });
  }

  async getData<T extends ParsedData>(data: T): Promise<T | undefined> {
    const id = this.getId(data);
    return (await this.getFullData()).find((databaseData) => this.getId(databaseData) === id) as T | undefined;
  }

  private async initialize(): Promise<void> {
    try {
      await access(this.filePath);
    } catch {
      await this.atomicWrite(this.basicData);
    }
  }

  private enqueueWrite<Result>(operation: () => Promise<Result>): Promise<Result> {
    const result = this.writeQueue.then(operation);
    this.writeQueue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  private async atomicWrite(data: Data): Promise<void> {
    const temporaryPath = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(data, null, 2), "utf-8");
    await rename(temporaryPath, this.filePath);
  }
}

export default GenericManager;
