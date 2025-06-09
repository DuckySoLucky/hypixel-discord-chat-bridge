const config = require("../../../config.json");
// const { ImgurClient } = require("imgur");

// const imgurClient = new ImgurClient({
//   clientId: config.minecraft.API.imgurAPIkey
// });

/**
 * Uploads image to Discord channel
 * @param {Buffer<ArrayBufferLike>|string} image
 */
async function uploadImage(image, url = false) {
  // const response = await imgurClient.upload({
  //  image: image
  // });
  // if (response.success === false) {
  //    throw "An error occured while uploading the image. Please try again later.";
  // }
  // return response;

  const data = { files: [image], content: null };
  if (url) {
    // @ts-ignore
    data.content = image;
    data.files = [];
  }

  try {
    /** @type {import('discord.js').Client} */
    // @ts-ignore
    await client.channels.cache.get(config.discord.channels.guildChatChannel).send(data);

    console.log("Image uploaded to Discord channel.");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadImage };
