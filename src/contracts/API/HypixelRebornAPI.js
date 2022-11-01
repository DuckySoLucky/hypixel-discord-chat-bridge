// eslint-disable-next-line
const HypixelAPIReborn = require("hypixel-api-reborn");
const config = require("../../../config.json");

const hypixel = new HypixelAPIReborn.Client(config.api.hypixelAPIkey, {
  cache: true,
});

module.exports = hypixel;
