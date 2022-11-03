const hypixelAPIReborn = require('hypixel-api-reborn');
const config = require('../../../config.json')

const hypixel = new hypixelAPIReborn.Client(config.api.hypixelAPIkey, {cache: true});

module.exports = hypixel;