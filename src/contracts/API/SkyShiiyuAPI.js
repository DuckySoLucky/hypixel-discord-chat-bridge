const axios = require("axios");
const config = require("../../../config.json");

async function getProfile(username) {
  return (await axios.get(`${config.api.skyShiiyuAPI}/profile/${username}`))
    .data;
}

async function getTalismans(username) {
  return (await axios.get(`${config.api.skyShiiyuAPI}/talismans/${username}`))
    .data.profiles;
}

async function getSlayer(username) {
  return (await axios.get(`${config.api.skyShiiyuAPI}/slayers/${username}`))
    .data;
}

async function getCoins(username) {
  return (await axios.get(`${config.api.skyShiiyuAPI}/coins/${username}`)).data;
}

async function getBazaar() {
  return (await axios.get(`${config.api.skyShiiyuAPI}/bazaar`)).data;
}

async function getDungeons(username) {
  return (await axios.get(`${config.api.skyShiiyuAPI}/dungeons/${username}`))
    .data;
}

module.exports = {
  getProfile,
  getTalismans,
  getSlayer,
  getCoins,
  getBazaar,
  getDungeons,
};
