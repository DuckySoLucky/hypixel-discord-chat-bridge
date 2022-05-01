const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');

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
        //notation type
        //do notation stuff here
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

class NetWorthCommand extends MinecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'networth'
        this.aliases = ["nw"]
        this.description = 'Networth of specified user.'
    }

    async onCommand(username, message) {
        let args = this.getArgs(message);
        let msg = args.shift();
        if(msg){ 
            const nw = await getNetworth(msg)
            const nw1 = nw.data.networth + nw.data.bank + nw.data.purse
            const data = addNotation("oneLetters", nw1)
            const data2 = lmao(nw1)
            this.send(`/gc ${msg}\'s networth is $${data}`)
        }else{
            const nw = await getNetworth(username)
            const nw1 = nw.data.networth + nw.data.bank + nw.data.purse
            const data = addNotation("oneLetters", nw1)
            const data2 = lmao(nw1)
            this.send(`/gc ${username}\'s networth is $${data}`)
        }
    }
}

module.exports = NetWorthCommand;