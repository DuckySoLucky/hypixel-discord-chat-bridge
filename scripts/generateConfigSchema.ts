import zod from "zod";
import { Config } from "../src/types/config.js";
import { saveFile } from "./utils.js";

await saveFile("docs/config.schema.json", JSON.stringify(zod.toJSONSchema(Config)));
