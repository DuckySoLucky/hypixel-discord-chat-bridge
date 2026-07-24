const HypixelAPIReborn = require("hypixel-api-reborn");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));

const hypixel = new HypixelAPIReborn.Client(config.minecraft.API.hypixelAPIkey, {
  cache: true
});

module.exports = hypixel;
