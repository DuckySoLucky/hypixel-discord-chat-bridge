const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');

let rank

function readOrUpdateNumber(jsonFilePath, role) {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  
    role = role.toLowerCase()
    // Return the number from the JSON data based on the role
    if (role === 'legend') {
        return jsonData.legend;
    } else if (role === 'champion') {
        return jsonData.champion;
    } else if (role === 'knight') {
        return jsonData.knight;
    } else if (role === 'recruit') {
        return jsonData.recruit;
    } else {
        throw new Error('Invalid role. Use "Legend", "Champion", "Knight", or "Recruit".');
    }
  }

function numberWithCommas(x) {
    x = x.toString().split(".")[0]
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
async function getStatsFromUsername(username, profile) {
    return await getStatsFromUUID(await getUUIDFromUsername(username), profile)
}
async function getUUIDFromUsername(username) {
    if (!(/^[a-zA-Z0-9_]{2,16}$/mg.test(username))) {
        return "Username Error"
    }
    else {
        const { data } = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + username)
        let uuid = data.id
        let user = username
        return data.id
    }
}
async function getStatsFromUUID(name, profile) {
    let challenger = 12000
    let expert = 20000
    let master = 30000

    try {
        if (name == undefined) {
            name = "a"
        }
        if (profile == undefined) {
            profile = "b"
        }
        if (name == "a7cb7319ac7547f0802116f38dc5ca85") {
            rank = "champ"
            return rank
        }
        if (name=="6f597f3249d740f290c3991526035a7c") {
            rank = "ini"
            return rank
        }
        const { data } = await axios.get('http://192.168.0.7:3000/v2/profiles/' + name + '?key=77ac89bad625453facaa36457eb3cf5c')

        console.log(data)
        let newlvl = 0
        for (b = 0; b < Object.keys(data.data).length; b++) {
            if (newlvl < data.data[b].sblevel) {
                newlvl = data.data[b].sblevel
            }
        }
        console.log(newlvl)
        if (newlvl >= legend) {
            rank = "leg"
            return rank
        }
        else if (newlvl >= champion) {
            rank = "champ"
            return rank
        }
        else if (newlvl >= knight) {
            rank = "vet"
            return rank
        }
        else {
            rank = "ini"
            return rank
        }

    }
    catch (error) {
        return `[ERROR] ${error.response.data.reason}`
    }

}

class ClaimCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'claim'
        this.description = "Claims ranks"
    }
    async onCommand(username, message) {
        let args = message.split(" ")
        getStatsFromUsername(username, args[1]).then(rank => {
            if(rank == "leg") {
                this.send(`/g setrank ${username} Legend`)
                setTimeout(() => {
                    this.send(`/gc ${username}'s rank has been set to Legend! If this is wrong, make sure you're on your main profile, and APIs are on!`)
                }, 1000);
            }
            if (rank == "champ") {
                this.send(`/g setrank ${username} Champion`)
                setTimeout(() => {
                    this.send(`/gc ${username}'s rank has been set to Champion! If this is wrong, make sure you're on your main profile, and APIs are on!`)
                }, 1000);
            }
            if (rank == "vet") {
                this.send(`/g setrank ${username} Knight`)
                setTimeout(() => {
                    this.send(`/gc ${username}'s Your rank has been set to Knight! If this is wrong, make sure you're on your main profile, and APIs are on!`)
                }, 1000);
            }
            if (rank == "ini") {
                this.send(`/g setrank ${username} Recruit`)
                setTimeout(() => {
                    this.send(`/gc ${username}'s rank has been set to Recruit! If this is wrong, make sure you're on your main profile, and APIs are on!`)
                }, 1000);
            }
        })
    }
}
module.exports = ClaimCommand