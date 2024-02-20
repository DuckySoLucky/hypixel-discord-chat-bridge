const config = require("../../../config.json");
const { ImgurClient } = require("imgur");

const imgurClient = new ImgurClient({
  clientId: config.minecraft.API.imgurAPIkey,
});

async function uploadImage(image) {
  console.log(image)
  const response = await imgurClient.upload({
    image: image,
  });

  console.log(response)

  if (response.success === false) {
    // eslint-disable-next-line no-throw-literal
    throw "An error occured while uploading the image. Please try again later.";
  }

  return response;
}

module.exports = { uploadImage };
