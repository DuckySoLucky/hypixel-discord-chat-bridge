import HypixelDiscordChatBridgeError from "../private/error.js";
import { access, readFile, writeFile } from "node:fs/promises";
import type DataManager from "./DataManager.js";
import type GenericData from "./GenericData.js";

abstract class GenericManager<JSONData, Data, ParsedData extends GenericData<JSONData, Data, any>> {
  constructor(
    readonly data: DataManager,
    private readonly filePath: string,
    private readonly name: string,
    basicData: Data
  ) {
    this.init(basicData);
  }

  private async init(basicData: Data) {
    try {
      await access(this.filePath);
    } catch {
      await writeFile(this.filePath, JSON.stringify(basicData));
    }
  }

  protected async getFile(): Promise<Data> {
    const data = await readFile(this.filePath);
    if (!data) throw new HypixelDiscordChatBridgeError(`The ${this.name} data file does not exist. Please contact an administrator.`);
    const parsed = JSON.parse(data.toString());
    if (!parsed) throw new HypixelDiscordChatBridgeError(`The ${this.name} data file is malformed. Please contact an administrator.`);
    return parsed;
  }

  abstract parseData(data: Data): ParsedData[];

  async getFullData(): Promise<ParsedData[]> {
    return this.parseData(await this.getFile());
  }

  async writeData(data: Data): Promise<ParsedData[]> {
    await writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
    return this.parseData(data);
  }

  async getData<T extends ParsedData>(data: T): Promise<T | undefined> {
    return (await this.getFullData()).find((databaseData) => databaseData === data) as T | undefined;
  }
}

export default GenericManager;
