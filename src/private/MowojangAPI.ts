import { Client } from "mowojang";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync("config.json", "utf-8"));
const MowojangAPI = new Client({ validation: { minimumUsernameLength: 1 }, baseURL: config.API.mowojang.baseURL || undefined });
export default MowojangAPI;
