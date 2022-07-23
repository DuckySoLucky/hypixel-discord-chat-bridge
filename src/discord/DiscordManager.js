const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./CommandHandler')
const generateMessageImage = require('../contracts/messageToImage')
const { Client, Collection, MessageAttachment } = require('discord.js');
const config = require('../../config.json')
const fs = require('fs')
const path = require('node:path');
const Logger = require('.././Logger')

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.messageHandler = new MessageHandler(this)
    this.commandHandler = new CommandHandler(this)
  }

  connect() {
    global.client = new Client({intents: 32767});
    this.client = client

    this.client.on('ready', () => this.stateHandler.onReady())
    this.client.on('message', message => this.messageHandler.onMessage(message))

    this.client.login(config.discord.token).catch(error => {Logger.errorMessage(error)})

    client.commands = new Collection();
    const commandFiles = fs.readdirSync('src/discord/commands').filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.data.name, command);
    }

    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {client.once(event.name, (...args) => event.execute(...args));} 
      else {client.on(event.name, (...args) => event.execute(...args));} 
    }

    process.on('SIGINT', () => this.stateHandler.onClose())
  }
  
  async getWebhook(discord, type) {
    let channel = discord.client.channels.cache.get(config.discord.guildChatChannel)
    if (type == 'Officer') {channel = discord.client.channels.cache.get(config.discord.officerChannel)}
    if (type == 'Logger') {channel = discord.client.channels.cache.get(config.discord.loggingChannel)}
  
    let webhooks = await channel.fetchWebhooks()
    if (webhooks.first()) {
      return webhooks.first()
    } else {
      var res = await channel.createWebhook(discord.client.user.username, {
        avatar: discord.client.user.avatarURL(),
      })
      return res
    }
  }

  async onBroadcast({ fullMessage, username, message, guildRank, chat }) {
    if (message == 'debug_temp_message_ignore') if (config.discord.messageMode != 'minecraft') return
    if (chat != 'debugChannel') Logger.broadcastMessage(`${username} [${guildRank}]: ${message}`, `Discord`)
    switch (config.discord.messageMode.toLowerCase()) {
      case 'bot':
        if (chat == 'Guild') {
          this.app.discord.client.channels.fetch(config.discord.guildChatChannel).then(channel => {
            channel.send({
              embeds: [{
                description: message,
                color: '6495ED',
                timestamp: new Date(),
                footer: {
                  text: guildRank,
                },
                author: {
                  name: username,
                  icon_url: 'https://www.mc-heads.net/avatar/' + username,
                },
              }],
            })
          })
          break
        } else if (chat == 'Officer'){
          this.app.discord.client.channels.fetch(config.discord.officerChannel).then(channel => {
            channel.send({
              embeds: [{
                description: message,
                color: '6495ED',
                timestamp: new Date(),
                footer: {
                  text: guildRank,
                },
                author: {
                  name: username,
                  icon_url: 'https://www.mc-heads.net/avatar/' + username,
                },
              }],
            })
          })
          break
        }

      case 'webhook':
        message = message.replace(/@/g, '')
        this.app.discord.webhook = await this.getWebhook(this.app.discord, chat)
        this.app.discord.webhook.send({
          content: message, username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username
        })
        break
      
      case 'minecraft':
        if (chat == 'Guild') {
          await client.channels.cache.get(config.discord.guildChatChannel).send({
            files: [new MessageAttachment(generateMessageImage(fullMessage), `guildChat.png`)],
          })
          if (fullMessage.includes('http') || fullMessage.includes('https')) await client.channels.cache.get(config.discord.guildChatChannel).send({content: `${message}`})
        }
        if (chat == 'Officer') {
          await client.channels.cache.get(config.discord.officerChannel).send({
            files: [new MessageAttachment(generateMessageImage(fullMessage), `officerChat.png`)],
          })
          if (fullMessage.includes('http') || fullMessage.includes('https')) await client.channels.cache.get(config.discord.officerChannel).send({content: `${message}`})
        }
        if (chat == 'debugChannel') {
          if (config.console.debug) {
            await client.channels.cache.get(config.console.debugChannel).send({
              files: [new MessageAttachment(generateMessageImage(fullMessage), `debugChat.png`)],
            })
            if (fullMessage.includes('http') || fullMessage.includes('https')) await client.channels.cache.get(config.console.debugChannel).send({content: `${message}`})
          }
        }
        break
        
      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }

  onBroadcastCleanEmbed({ message, color, channel }) {
    if (message.length < config.console.maxEventSize)
      Logger.broadcastMessage(message, 'Event')
    if (channel == 'Logger')  {
      this.app.discord.client.channels.fetch(config.discord.loggingChannel).then(channel => {
        channel.send({
          embeds: [{
            color: color,
            description: message,
          }]
        })
      })
    } else {
      this.app.discord.client.channels.fetch(config.discord.guildChatChannel).then(channel => {
        channel.send({
          embeds: [{
            color: color,
            description: message,
          }]
        })
      })
    } 
  }  

  onBroadcastHeadedEmbed({ message, title, icon, color, channel }) {
    if (message) {
      if (message.length < config.console.maxEventSize)
        Logger.broadcastMessage(message, 'Event')
    }
    if (channel == 'Logger')  {
      this.app.discord.client.channels.fetch(config.discord.loggingChannel).then(channel => {
        channel.send({
          embeds: [{
            color: color,
            author: {
              name: title,
              icon_url: icon,
            },
            description: message,
          }]
        })
      })
    } else { 
      this.app.discord.client.channels.fetch(config.discord.guildChatChannel).then(channel => {
        channel.send({
          embeds: [{
            color: color,
            author: {
              name: title,
              icon_url: icon,
            },
            description: message,
          }]
        })
      })
    }
  }

  async onPlayerToggle({ fullMessage, username, message, color, channel}) {
    Logger.broadcastMessage(username + ' ' + message, 'Event')
    switch (config.discord.messageMode.toLowerCase()) {
      case 'bot':
        if (channel == 'Logger') {
          this.app.discord.client.channels.fetch(config.discord.loggingChannel).then(channel => {
            channel.send({
              embeds: [{
                color: color,
                timestamp: new Date(),
                author: {
                  name: `${username} ${message}`,
                  icon_url: 'https://www.mc-heads.net/avatar/' + username,
                },
              }]
            })
          })
          break
        } else {
          this.app.discord.client.channels.fetch(config.discord.guildChatChannel).then(channel => {
            channel.send({
              embeds: [{
                color: color,
                timestamp: new Date(),
                author: {
                  name: `${username} ${message}`,
                  icon_url: 'https://www.mc-heads.net/avatar/' + username,
                },
              }]
            })
          })
          break 
        }

      case 'webhook':
        if (channel == 'Guild') {
          this.app.discord.webhook = await this.getWebhook(this.app.discord, 'Guild')
          this.app.discord.webhook.send({
            username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username, embeds: [{
              color: color,
              description: `${username} ${message}`,
            }]
          })
        }
        if (channel == 'Logger') {
          this.app.discord.webhook = await this.getWebhook(this.app.discord, 'Logger')
          this.app.discord.webhook.send({
            username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username, embeds: [{
              color: color,
              description: `${username} ${message}`,
            }]
          })
        }
        break
      case 'minecraft':
        if (channel == 'Guild') {
          await client.channels.cache.get(config.discord.guildChatChannel).send({
            files: [new MessageAttachment(generateMessageImage(fullMessage), `GuildChat.png`)],
          })
        }
        break
      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }
}

module.exports = DiscordManager
