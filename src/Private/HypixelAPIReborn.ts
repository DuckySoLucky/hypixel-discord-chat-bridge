import config from "../../config.json" with { type: "json" };
import { Client } from "hypixel-api-reborn";

const HypixelAPIReborn = new Client(config.minecraft.API.hypixelAPIkey, { cache: true });
export default HypixelAPIReborn;
