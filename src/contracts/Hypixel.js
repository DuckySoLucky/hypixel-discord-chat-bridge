const HypixelAPIReborn = require('hypixel-api-reborn');
const config = require('../../config.json')
const hypixel = new HypixelAPIReborn.Client(config.minecraft.apiKey, {cache: true});
module.exports = hypixel;