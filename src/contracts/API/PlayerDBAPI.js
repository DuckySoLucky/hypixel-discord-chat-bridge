const axios = require("axios");

async function getUUID(username) {
  try {
    const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);

    if (data.success === false || data.error === true) {
      throw data.message == "Mojang API lookup failed." ? "Invalid username." : data.message;
    }

    if (data.id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No UUID found for that username.";
    }

    return data.id;
  } catch (error) {
    throw error?.response?.data?.message == "Mojang API lookup failed."
      ? "Invalid username."
      : error?.response?.data?.message;
  }
}

async function getUsername(uuid) {
  try {
    const response = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    return response.data.name;
  } catch (error) {
    console.log(error);
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    const { data } = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${username}`);

    if (data.success === false || data.error === true) {
      throw data.message == "Mojang API lookup failed." ? "Invalid username." : data.message;
    }

    if (data.data?.id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No UUID found for that username.";
    }

    return {
      username: data.name,
      uuid: data.id,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };