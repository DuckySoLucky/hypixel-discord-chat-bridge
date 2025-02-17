const axios = require("axios");

const uuidCache = new Map();
const usernameCache = new Map();

async function getUUID(username) {
  try {
    if (uuidCache.has(username)) {
      const data = uuidCache.get(username);

      if (data.last_save + 43200000 > Date.now()) {
        return data.id;
      }
    }

    const { data } = await axios.get(`https://mowojang.matdoes.dev/${username}`);

    if (data.errorMessage || data.id === undefined) {
      throw data.errorMessage ?? "Invalid username.";
    }

    uuidCache.set(username, {
      last_save: Date.now(),
      id: data.id
    });

    return data.id;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    if (error.response.data === "Not found") throw "Invalid username.";
    console.error(error);
    throw error;
  }
}

async function getUsername(uuid) {
  try {
    if (usernameCache.has(uuid)) {
      const data = usernameCache.get(uuid);

      if (data.last_save + 43200000 > Date.now()) {
        return data.username;
      }
    }

    const { data } = await axios.get(`https://mowojang.matdoes.dev/${uuid}`);
    if (data.errorMessage || data.name === undefined) {
      throw data.errorMessage ?? "Invalid UUID.";
    }

    const cache = {
      last_save: Date.now(),
      username: data.name
    };

    usernameCache.set(uuid, cache);

    return data.name;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line no-throw-literal
    if (error.response?.data === "Not found") throw "Invalid UUID.";
    throw error;
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    const { data } = await axios.get(`https://mowojang.matdoes.dev/${username}`);

    return {
      username: data.name,
      uuid: data.id
    };
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    if (error.response.data === "Not found") throw "Invalid Username Or UUID.";
    console.error(error);
    throw error;
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };
