const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
function convertSecondsToMinutesAndSeconds(milliseconds) {
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    //let seconds = milliseconds;
    //let minutes = Math.floor(seconds / 60);
    //seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
function convertSecondsToHoursMinutesAndSeconds(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    var minutes = Math.floor((milliseconds % 3600000) / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return (hours > 0 ? (hours < 10 ? "0" : "") + hours + ":" : "") + 
           (minutes < 10 ? "0" : "") + minutes + ":" + 
           (seconds < 10 ? "0" : "") + seconds;
}
async function capitalizeFirstLetter(string) {
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
   }
   return result;
}
async function getJacobs() {
    const { data } = await axios.get("https://dawjaw.net/jacobs")
    for (jEvent of data) {
        let currentTime = Date.now();
        let eventTime = jEvent['time'] * 1000;
        if (currentTime < eventTime) {
            let delta = eventTime - currentTime;
            let timeUntilJacobEvent = convertSecondsToMinutesAndSeconds(delta);
            let eventString = [];
            jEvent['crops'].forEach((crop) => {
                eventString.push(crop);
            });
            let contest = `The next contest starts in: ${timeUntilJacobEvent}\n\nCrops: \n- ${eventString.toString().replaceAll(",",", ")}`
            return contest
        }
    }
}
async function getJacobsSpecific(crop) {
    const { data } = await axios.get("https://dawjaw.net/jacobs")
    for (jEvent of data) {
        let currentTime = Date.now();
        let eventTime = jEvent['time'] * 1000;
        if (currentTime < eventTime && jEvent['crops'].includes(crop)) {
            let delta = eventTime - currentTime;
            let timeUntilJacobEvent = convertSecondsToHoursMinutesAndSeconds(delta);
            let eventString = [];
            jEvent['crops'].forEach((crop) => {
                eventString.push(crop);
            });
            eventString = eventString.filter(element => element !== crop)
            let contest = `**The next ${crop} contest is in:**\n ${timeUntilJacobEvent} \n\n**and also has:**\n- ${eventString.toString().replaceAll(","," and ")}`
            return contest
        }
    }
}
class JacobCommand extends DiscordCommand {
    constructor(discord) {
        super(discord)
        this.permission = "all"

        this.name = 'contest'

        this.description = "Tells you when next contest general is, or next specific contest is."
    }

    async onCommand(message) {
        let args = this.getArgs(message)
        let crop = args.shift()
        if(crop != undefined){
                if(crop.toLowerCase() == "cocoa"){
                    crop = "Cocoa Beans"
                }
                else if(crop.toLowerCase() == "wart"){
                    crop = "Nether Wart"
                }
                else if(crop.toLowerCase() == "cane"){
                    crop = "Sugar Cane"
                }
                else if(crop.toLowerCase() == "rose"){
                    crop = "Wild Rose"
                }
                else{
                    crop = await capitalizeFirstLetter(crop)
                }
                getJacobsSpecific(crop).then(contest => {
                    message.channel.send({
                        embeds: [{
                            description: contest.replaceAll("\n\nand ","\n\nIt ").replaceAll(" and ","\n- "),
                            color: 0xcbbeb5,
                            timestamp: new Date(),
                            footer: {
                                text: "BOT",
                            },
                        }],
                    })
                    this.sendMinecraftMessage(`/gc ${contest.replaceAll("\n\n","").replaceAll(":**\n-","").replaceAll(":**\n","").replaceAll("*","")}`)
                })
        }
        else{
            getJacobs().then(contest => {
                message.channel.send({
                    embeds: [{
                        description: contest.replaceAll(", ","\n- ").replaceAll("Crops:","**Crops:**").replaceAll("The next contest starts in:","**The next contest starts in:**\n"),
                        color: 0xcbbeb5,
                        timestamp: new Date(),
                        footer: {
                            text: "BOT",
                        },
                    }],
                })
                this.sendMinecraftMessage(`/gc ${contest.replaceAll("\n- ","").replaceAll("\n\n"," ┃ ").replaceAll("- ","")}`)
            })
        }
    }
}

module.exports = JacobCommand