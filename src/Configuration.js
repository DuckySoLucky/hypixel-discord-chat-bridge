const fs = require('fs')

class Configuration {
  properties = {
    server: {
      host: 'localhost',
      port: 25565,
    },
    minecraft: {
      username: null,
      password: null,
      lobbyHolder: null,
      accountType: 'mojang',
    },
    discord: {
      token: null,
      channel: null,
      commandRole: '',
      ownerId: '',
      prefix: '!',
      messageMode: 'bot'
    },
  }

  environmentOverrides = {
    SERVER_HOST: val => (this.properties.server.host = val),
    SERVER_PORT: val => (this.properties.server.port = val),
    MINECRAFT_USERNAME: val => (this.properties.minecraft.username = val),
    MINECRAFT_PASSWORD: val => (this.properties.minecraft.password = val),
    MINECRAFT_LOBBY_HOLDER: val => (this.properties.minecraft.lobbyHolder = val),
    MINECRAFT_ACCOUNT_TYPE: val => (this.properties.minecraft.accountType = val),
    DISCORD_TOKEN: val => (this.properties.discord.token = val),
    DISCORD_CHANNEL: val => (this.properties.discord.channel = val),
    DISCORD_COMMAND_ROLE: val => (this.properties.discord.commandRole = val),
    DISCORD_OWNER_ID: val => (this.properties.discord.ownerId = val),
    DISCORD_PREFIX: val => (this.properties.discord.prefix = val),
    MESSAGE_MODE: val => (this.properties.discord.messageMode = val),
  }

  constructor() {
    if (fs.existsSync('config.json')) {
      this.properties = require('../config.json')
    }

    for (let environment of Object.keys(process.env)) {
      if (this.environmentOverrides.hasOwnProperty(environment)) {
        this.environmentOverrides[environment](process.env[environment])
      }
    }
  }

  get server() {
    return this.properties.server
  }

  get minecraft() {
    return this.properties.minecraft
  }

  get discord() {
    return this.properties.discord
  }
}

module.exports = Configuration
