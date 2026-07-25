import config from "../../config.json" with { type: "json" };
import { Client } from "mowojang";

const MowojangAPI = new Client({ baseURL: config.API.mowojang.baseURL || undefined });
export default MowojangAPI;
