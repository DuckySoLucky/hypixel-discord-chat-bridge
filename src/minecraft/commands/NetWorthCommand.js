const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

const getActiveProfile = function (profiles, uuid) {
  return profiles.sort((a, b) => b.members[uuid].last_save - a.members[uuid].last_save)[0];
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
        let temp = this;
        if(msg){ 
            const response = await axios.get('http://localhost:3000/v1/profiles/' + msg + '?key=DuckySoLucky')
            .then(function (response) {
                if(response.status == 404){temp.send('/gc The provided username doesn\'t exist!');}

                const data = addNotation("oneLetters", response.data.data[0].networth.total_networth);
                temp.send(`/gc ${msg}\'s networth is $${data}`)
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});

        }else{
            const response = await axios.get('http://localhost:3000/v1/profiles/' + username + '?key=DuckySoLucky')
            .then(function (response) {
                if(response.status == 404){temp.send('/gc The provided username doesn\'t exist!');}

                const data = addNotation("oneLetters", response.data.data[0].networth.total_networth);
                temp.send(`/gc ${username}\'s networth is $${data}`)
            }).catch(()=>{this.send(`/gc ${username} the provided username doesn\'t exist!`)});
        }
    }
}

module.exports = NetWorthCommand;