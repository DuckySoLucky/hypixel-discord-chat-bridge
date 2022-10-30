const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/API/HypixelRebornAPI')

class guildOfCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'guild'
        this.aliases = ['g']
        this.description = "Looks up a guild based of the name."
    }

    async onCommand(username, message) {
        try {
            // get the guild name
            const args = message.split(' ')
            let guild = '';
            for (let i = 1; i < args.length; i++) {
                guild = guild + args[i] + " "
            }
            guild = guild.trim()
            hypixel.getGuild('name', guild).then((data) => {
                this.send(`/gc Guild info for ${data.name} - Tag: ${data.tag} Members: ${data.members.length} Level: ${data.level} Achievements: Online Players: ${data.achievements.onlinePlayers} Winners: ${data.achievements.winners}`)
            }).catch((error) => {
                this.send(`/gc ${guild} does not exist!`)
                console.log(error)
            })
        } catch (error) {
            console.log(error)
            this.send('/gc Something went wrong..')
        }
    }
}


module.exports = guildOfCommand;