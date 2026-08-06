import config from "../../config.json" with { type: "json" };
import { Client } from "mowojang";

const MowojangAPI = new Client({ validation: { minimumUsernameLength: 1 }, baseURL: config.API.mowojang.baseURL || undefined });
export default MowojangAPI;
