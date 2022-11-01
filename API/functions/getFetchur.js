const items = require("../constants/fetchur_items.js");

function getFetchur() {
  try {
    const today = new Date();
    today.setHours(today.getHours() - 6);
    const day = today.getDate();
    let item;
    if (day <= 12) {
      item = items[day];
    }
    item = items[day % 12];
    return item;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getFetchur };
