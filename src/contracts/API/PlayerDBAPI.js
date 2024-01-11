const axios = require("axios");
const config = require("../../../config.json");

let ign_cache = {}; // IGN to UUID Cache
let uuid_cache = {}; // UUID to IGN Cache

function getIGNCache(username) {
  try {
    let value = ign_cache[username.toLowerCase()];
    if (value === undefined) {
      return false;
    }

    if (Date.now() - value.cachedAt > 5 * 60 * 1000) {
      return false;
    }

    return value.uuid;
  } catch (e) {
    return false;
  }
}
function saveIGNCache(username, uuid) {
  try {
    let timestamp = Date.now();
    ign_cache[username.toLowerCase()] = {
      cachedAt: timestamp,
      uuid: uuid,
    };
  } catch (e) {
    console.log(e);
  }
}

function getUUIDCache(uuid) {
  try {
    let value = uuid_cache[uuid];
    if (value === undefined) {
      return false;
    }

    if (Date.now() - value.cachedAt > 5 * 60 * 1000) {
      return false;
    }

    return value.username;
  } catch (e) {
    return false;
  }
}
function saveUUIDCache(uuid, username) {
  try {
    let timestamp = Date.now();
    uuid_cache[uuid] = {
      cachedAt: timestamp,
      username: username,
    };
  } catch (e) {
    console.log(e);
  }
}

async function getUUID(username) {
  let cache_value = getIGNCache(username);
  if (cache_value !== false) {
    return cache_value;
  }

  try {
    const { data } = await axios.get(`${config.minecraft.API.resolvers.IGN_to_UUID}/${username}`);

    if (data.id === undefined) {
      throw "Invalid username.";
    }

    saveIGNCache(username, data.id);
    return data.id;
  } catch (error) {
    if (error?.response?.status == 404) {
      throw "Invalid username.";
    }
    if (error?.response?.status == 429) {
      throw "Bot got rate limited. Try again later.";
    }
    throw "API Lookup failed.";
  }
}

async function getUsername(uuid) {
  let cache_value = getUUIDCache(uuid);
  if (cache_value !== false) {
    return cache_value;
  }

  try {
    const { data } = await axios.get(`${config.minecraft.API.resolvers.UUID_to_IGN}/${uuid}`);

    if (data.name === undefined) {
      throw "Invalid username.";
    }

    saveUUIDCache(uuid, data.name);
    return data.name;
  } catch (error) {
    if (error?.response?.status == 404) {
      console.log("Invalid UUID.");
    }
    if (error?.response?.status == 429) {
      console.log("Bot got rate limited. Try again later.");
    }
    console.log("API Lookup failed.");
    return "undefined";
  }
}

async function resolveUsernameOrUUID(username) {
  let cached_player_uuid = getIGNCache(username);
  if (cached_player_uuid !== false) {
    let cached_player_username = getUUIDCache(cached_player_uuid);

    return { username: cached_player_username, uuid: cached_player_uuid };
  }

  try {
    const { data } = await axios.get(`${config.minecraft.API.resolvers.IGN_to_UUID}/${username}`);

    if (data.id === undefined) {
      throw "Invalid username.";
    }

    if (data.name === undefined) {
      throw "Invalid username.";
    }

    saveUUIDCache(data.id, data.name);
    saveIGNCache(data.name, data.id);

    return { username: data.name, uuid: data.id };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };
