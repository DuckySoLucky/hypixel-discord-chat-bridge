const items = require("../constants/fetchur_items.js");

function getFetchur() {
  const today = new Date();
  today.setHours(today.getHours() - 6);
  const day = today.getDate();
  // @ts-ignore
  const item = day <= 12 ? items[day] : items[day % 12];
  return item;
}

module.exports = { getFetchur };
