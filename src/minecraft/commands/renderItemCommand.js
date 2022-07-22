const MinecraftCommand = require('../../contracts/MinecraftCommand')
process.on('uncaughtException', function (err) {console.log(err.stack)});
const { getPlayer, decodeData } = require('../../contracts/functions');
const { renderLore } = require('../../contracts/renderItem')
const { ImgurClient } = require('imgur');
const imgurClient = new ImgurClient({ clientId: '5fd67f62f4f1a59' });

class renderCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'render'
    this.aliases = ['r']
    this.description = "Renders item of specified user."
  }

  async onCommand(username, message) {
    let itemNumber, arg = this.getArgs(message)

    if (arg[0]) username = arg[0]
    if (!arg[0]) this.send('/gc Wrong Usage: !render [name] [slot] | !render [slot]')

    if (!isNaN(Number(arg[0]))) {
      itemNumber = arg[0];
    } else {
      username = arg[0]
      if (!isNaN(Number(arg[1]))) {
        itemNumber = arg[1]
      } else {
        this.send('/gc Wrong Usage: !render [name] [slot] | !render [slot]')
        return
      }
    }
    const searchedPlayer = await getPlayer(username).catch((err) => {this.send(`/gc Error: ${err}`)})
    const playerProfile = searchedPlayer.memberData
    const inventory = playerProfile?.inv_contents?.data
    if (!inventory) {this.send(`/gc This player has an Inventory API off.`)}
    const inventoryData = (await decodeData(Buffer.from(inventory, 'base64'))).i

    const selectedItem = inventoryData[itemNumber - 1]
    if (!selectedItem || !Object.keys(selectedItem || {}).length) {this.send(`/gc Player does not have an item at slot ${itemNumber}.`)}

    const renderedItem = await renderLore(selectedItem?.tag?.display?.Name, selectedItem?.tag?.display?.Lore)
    const upload = await imgurClient.upload({image: renderedItem, type: 'stream'})
    if (!upload.data.link) this.send(`/gc There was an error with Imgur, try again.`);
    if (searchedPlayer.profileData.game_mode == "ironman") username = `♲ ${username}`
    this.send(`/gc ${username}'s item at slot ${itemNumber} » ${upload.data.link}`);
  }
}

module.exports = renderCommand;
