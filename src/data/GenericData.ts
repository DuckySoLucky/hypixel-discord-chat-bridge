import type GenericManager from "./GenericManager.js";

abstract class GenericData<JSONData, Data, Manager extends GenericManager<JSONData, Data, any>> {
  constructor(readonly manager: Manager) {}

  abstract save(...args: any[]): Promise<typeof this>;
  abstract delete(...args: any[]): Promise<GenericData<JSONData, Data, Manager>[]>;
  abstract toJSON(): JSONData;
}

export default GenericData;
