const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')
const axios = require('axios');
const { Player } = require('hypixel-api-reborn');

process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

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


class UpdateRankCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'updaterank'
    this.aliases = ['ur']
    this.description = "Upgrades your rank if u meet requirements."
  }

  async onCommand(username, message) {
    let args = this.getArgs(message);
    let temp = this;
    if (args[0] == 'skyblock') {
        const nw = await getNetworth(username)
        const nw1 = nw.data.networth + nw.data.bank + nw.data.purse
        let args = this.getArgs(message);
        axios({
            method: 'get',
            url: `https://sky.shiiyu.moe/api/v2/profile/${username}`
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

                if (skill > 34.99 || cata > 29.99 || nw1 > 299999999){
                    temp.send(`/gc You meet requirements for Elite!`)
                }else{
                    temp.send(`/gc You do not meet requirements!`)
                }
            }).catch(e => {console.error(e);});
    }else {
        hypixel.getPlayer(username).then(player => {
            if (player.stats.bedwars.level > 399 || player.stats.bedwars.level > 299 && player.stats.bedwars.finalKDRatio > 4.99 || player.stats.skywars.level > 24 || player.stats.skywars.level > 19 && player.stats.skywars.KDRatio > 3.99 || player.stats.duels.wins > 9999 || player.stats.duels.wins > 5999 && player.stats.duels.WLRatio > 3.99 || player.stats.uhc.starLevel > 5){
                temp.send(`/gc You meet requirements for Elite!`)
            }else{
                temp.send(`/gc You do not meet requirements!`)   
            }
		}).catch(e => {console.error(e);this.send(e);});
    }

  }
}
module.exports = UpdateRankCommand
