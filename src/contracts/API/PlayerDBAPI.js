const axios = require("axios");

const cache = new Map();

async function getUUID(username, full=false) {
  try {
    if (cache.has(username)) {
      const data = cache.get(username);

      if (data.last_save + 43200000 > Date.now()) {
        if(full){
          return {
            uuid: data.id,
            username: username
          };
        }

        return data.id;
      }
    }

    const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);

    if (data.errorMessage || data.id === undefined) {
      throw data.errorMessage ?? "Invalid username.";
    }

    let correct_uuid = data.id.replace(/-/g, "");

    cache.set(data.name, {
      last_save: Date.now(),
      id: correct_uuid,
    });

    if(full){
      return {
        uuid: correct_uuid,
        username: data.name
      };
    }
    return correct_uuid;
  } catch (error) {
    console.log(error)
    const err = error.response.status;
    if(err == 404){
      throw "Invalid username.";
    }
    if(err == 403){
      throw "Request was blocked.";
    }
    if(err == 400){
      throw "Malformed username."
    }
    throw `Code: ${err}`;
  }
}

async function getUsername(uuid) {
  try {
    const { data } = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    return data.name;
  } catch (error) {
    console.log(error);
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    return getUUID(username, true);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };