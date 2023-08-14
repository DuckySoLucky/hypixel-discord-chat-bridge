const axios = require("axios");

async function getUUID(username) {
  try {
    const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);

    if (data.errorMessage || data.id === undefined) {
      throw data.errorMessage ?? "Invalid username.";
    }

    return data.id;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.errorMessage === `Couldn't find any profile with name ${username}`
      ? "Invalid username."
      : error?.response?.data?.errorMessage ?? "Request to Mojang API failed. Please try again!";
  }
}

async function getUsername(uuid) {
  try {
    const response = await axios.get(`https://playerdb.co/api/player/minecraft/${uuid}`);
    return response.data.data.player.username;
  } catch (error) {
    console.log(error);
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    const { data } = await axios.get(`https://playerdb.co/api/player/minecraft/${username}`);

    if (data.success === false || data.error === true) {
      throw data.message == "Mojang API lookup failed." ? "Invalid username." : data.message;
    }

    if (data.data?.player?.raw_id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No UUID found for that username.";
    }

    return {
      username: data.data.player.username,
      uuid: data.data.player.raw_id,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };
