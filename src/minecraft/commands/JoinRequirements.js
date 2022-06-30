const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')
const axios = require('axios');
const { Player } = require('hypixel-api-reborn');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const getActiveProfile = function (profiles, uuid) {
  return profiles.sort((a, b) => b.members[uuid].last_save - a.members[uuid].last_save)[0];
};

const getNetworth = async function (name) {
  const name1 = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`)

  const uuid = name1.data.id

  const { data } = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=f0cc904f-34b8-4a8f-b77c-67530162eaa1&uuid=${uuid}`);

  const activeProfile = getActiveProfile(data.profiles, uuid);

  const profile = activeProfile.members[uuid];
  profile.banking = activeProfile.banking;

  const response = await axios.post('https://maro.skybrokers.xyz/api/networth/categories', { data: profile });
  
  return response.data;
};

function lmao(num){
    let arr = Array.from(String(num), num=>Number(num)).reverse();
    let temp = [];
    for(let i = 0; i<arr.length;i+=3){
        if(i+3>arr.length)temp.push(arr[i],arr[i+1]?arr[i+1]:"",arr[i+2]?arr[i+2]:"");
        else temp.push(arr[i],arr[i+1],arr[i+2],",");
    }
    return temp.reverse().join("");
}

function addNotation(type, value) {
    let returnVal = value;
    let notList = [];
    if (type === "shortScale") {
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ];
    }

    if (type === "oneLetters") {
        notList = [" K", " M", " B", " T"];
    }

    let checkNum = 1000;

    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1];
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift();
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100);
                    returnVal = Math.floor(returnVal);
                    returnVal = (returnVal / Math.pow(10, o)) * 10;
                    returnVal = +returnVal.toFixed(o - 1) + notValue;
                }
                checkNum *= 10;
            }
        }
    } else {
        returnVal = numberWithCommas(value.toFixed(0));
    }

    return returnVal;
}


class JoinRequirementsCommand extends MinecraftCommand {
    constructor(minecraft) {
      super(minecraft)
  
      this.name = 'requirements'
      this.aliases = ['reqs', 'req', 'join']
      this.description = "Check if Input meets requirements!."
    }

  async onCommand(username, message) {
    let args = this.getArgs(message);
    let p = args[0]
    let temp = this;
    if (args[1] == 'skyblock') {
        const nw = await getNetworth(p)
        const nw1 = nw.data.networth + nw.data.bank + nw.data.purse
        const data = addNotation("oneLetters", nw1)
        const data2 = lmao(nw1)
        let args = this.getArgs(message);
        axios({
            method: 'get',
            url: `https://sky.shiiyu.moe/api/v2/profile/${p}`
        }).then(function (response) {
            if(response.status >= 300){
                temp.send('/gc The provided username doesn\'t exist!');
            }
                let profile = {};
                Object.keys(response.data.profiles).forEach((key) => {
                    if (response.data.profiles[key].current)
                        profile = response.data.profiles[key];
                })
                let skill = (profile.data.average_level* 100) / 100
                let cata = profile.data.dungeons.catacombs.level.level


                if(skill > 24.99 || cata > 19.99 ||nw1 > 99999999) {
                    temp.send(`/gc ${p} meets requirements! Skill Average: ${Math.round(skill)} || Catacombs Level: ${cata} || Networth: $${data}`)
            
                }else{
                    temp.send(`/gc ${p} does not meet requirements! Skill Average: ${Math.round(skill)} || Catacombs Level: ${cata} || Networth: $${data}`)
                }
            }).catch(e => {console.error(e);});
    }else {
        hypixel.getPlayer(p).then(player => {

            if(player.stats.bedwars.level > 199 || player.stats.bedwars.level > 99 && player.stats.bedwars.finalKDRatio > 2.99 || player.stats.skywars.level > 14 || player.stats.skywars.level > 9 && player.stats.skywars.KDRatio > 1.99 || player.stats.duels.wins > 3999 || player.stats.duels.wins > 1999 && player.stats.duels.WLRatio > 1.99 || player.stats.uhc.starLevel > 2) {
                temp.send(`/gc ${p} Yes! BW: ${player.stats.bedwars.level}✫ & ${player.stats.bedwars.finalKDRatio} FKDR || SW: ${player.stats.skywars.level}✫ & ${player.stats.skywars.KDRatio} FKDR || Duels: ${player.stats.duels.wins} & ${player.stats.duels.WLRatio} WLR || UHC: ${player.stats.uhc.starLevel}✫ `)
            }else{
                temp.send(`gc ${p} No! BW: ${player.stats.bedwars.level}✫ & ${player.stats.bedwars.finalKDRatio} FKDR || SW: ${player.stats.skywars.level}✫ & ${player.stats.skywars.KDRatio} FKDR || Duels: ${player.stats.duels.wins} & ${player.stats.duels.WLRatio} WLR || UHC: ${player.stats.uhc.starLevel}✫ `)
            }
		}).catch(e => {console.error(e);this.send(e);});
    }

  }
}
module.exports = JoinRequirementsCommand
