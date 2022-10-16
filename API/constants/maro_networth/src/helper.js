const constants = require('./constants');
const nbt = require('prismarine-nbt');
const parseNbt = require('util').promisify(nbt.parse);

const slots = {
  normal: Object.keys(constants.gemstones),
  special: ['UNIVERSAL', 'COMBAT', 'OFFENSIVE', 'DEFENSIVE', 'MINING'],
  ignore: ['unlocked_slots']
};

const getKey = function (key) {
  const intKey = new Number(key);

  if (!isNaN(intKey)) {
    return intKey;
  }

  return key;
};

const decodeNBT = async function (data) {
  const buffer = Buffer.from(data, 'base64');
  const item = await parseNbt(buffer);

  if (item === undefined) {
    return null;
  }

  return item.value.i.value.value[0];
};

const getPath = function (obj, ...keys) {
  if (obj == null) {
    return undefined;
  }

  let loc = obj;

  for (let i = 0; i < keys.length; i++) {
    loc = loc[getKey(keys[i])];

    if (loc === undefined) {
      return undefined;
    }
  }

  return loc;
};

const getRawLore = function (text) {
  const parts = text.split('§');
  let output = '';

  for (const [index, part] of parts.entries()) {
    output += part.substring(Math.min(index, 1));
  }

  return output;
};

const removeReforge = function (text) {
  const items = constants.forge_items;

  if (!items.includes(text)) {
    text = text.split(' ').slice(1).join(' ');
  }

  return text;
};

const capitalize = function (str) {
  const words = str.replace(/_/g, ' ').toLowerCase().split(' ');

  const upperCased = words.map(word => {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });

  return upperCased.join(' ');
};

const parseItemGems = function (gems) {
  const parsed = [];

  for (const [key, value] of Object.entries(gems)) {
    if (slots.ignore.includes(key)) continue;

    const slot_type = key.split('_')[0];

    if (slots.special.includes(slot_type)) {
      parsed.push({ type: gems[`${key}_gem`], tier: value });
    } else if (slots.normal.includes(slot_type)) {
      parsed.push({ type: key.split('_')[0], tier: value });
    }
  }

  return parsed;
};

const getAverage = function (arr) {
  const average = arr.reduce((a, b) => a + b, 0) / arr.length;

  if (!average) {
    return 0;
  }

  return average;
};

const getMedian = function (values) {
  if (!values.length) return 0;

  values.sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
};

const getMean = function (numbers) {
  let total = 0;

  for (let i = 0; i < numbers.length; i += 1) {
    total += numbers[i];
  }

  return total / numbers.length;
};

const getMode = function (numbers) {
  numbers.sort((x, y) => x - y);

  let bestStreak = 1;
  let bestElem = numbers[0];
  let currentStreak = 1;
  let currentElem = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i - 1] !== numbers[i]) {
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        bestElem = currentElem;
      }

      currentStreak = 0;
      currentElem = numbers[i];
    }

    currentStreak++;
  }

  return currentStreak > bestStreak ? currentElem : bestElem;
};

const toTimestamp = function (timestamp) {
  return Date.parse(timestamp)/1000
}

const nth = function(i) {
  return i + ['st', 'nd', 'rd'][((((i + 90) % 100) - 10) % 10) - 1] || `${i}th`;
}


// CREDITS: https://github.com/grafana/grafana (Modified)

const units = new Set(['y', 'M', 'w', 'd', 'h', 'm', 's']);

function parseDateMath(mathString, time) {
  const strippedMathString = mathString.replace(/\s/g, '');
  const dateTime = time;
  let i = 0;
  const { length } = strippedMathString;

  while (i < length) {
    const c = strippedMathString.charAt(i);
    i += 1;
    let type;
    let number;

    if (c === '/') {
      type = 0;
    } else if (c === '+') {
      type = 1;
    } else if (c === '-') {
      type = 2;
    } else {
      return;
    }

    if (Number.isNaN(Number.parseInt(strippedMathString.charAt(i), 10))) {
      number = 1;
    } else if (strippedMathString.length === 2) {
      number = strippedMathString.charAt(i);
    } else {
      const numberFrom = i;
      while (!Number.isNaN(Number.parseInt(strippedMathString.charAt(i), 10))) {
        i += 1;
        if (i > 10) {
          return;
        }
      }
      number = Number.parseInt(strippedMathString.slice(numberFrom, i), 10);
    }

    if (type === 0 && number !== 1) {
      return;
    }

    const unit = strippedMathString.charAt(i);
    i += 1;

    if (!units.has(unit)) {
      return;
    }
    if (type === 0) {
      dateTime.startOf(unit);
    } else if (type === 1) {
      dateTime.add(number, unit);
    } else if (type === 2) {
      dateTime.subtract(number, unit);
    }
  }

  return dateTime;
}

const parseTimestamp = function(text) {
  if (!text) return;

  if (typeof text !== 'string') {
    if (moment.isMoment(text)) {
      return text;
    }
    if (moment.isDate(text)) {
      return moment(text);
    }
    return;
  }

  let time;
  let mathString = '';
  let index;
  let parseString;

  if (text.slice(0, 3) === 'now') {
    time = moment.utc();
    mathString = text.slice(3);
  } else {
    index = text.indexOf('||');
    if (index === -1) {
      parseString = text;
      mathString = '';
    } else {
      parseString = text.slice(0, Math.max(0, index));
      mathString = text.slice(Math.max(0, index + 2));
    }

    time = moment(parseString, moment.ISO_8601);
  }

  if (mathString.length === 0) {
    return time.valueOf();
  }

  const dateMath = parseDateMath(mathString, time);
  return dateMath ? dateMath.valueOf() : undefined;
}

module.exports = { getPath, decodeNBT, getRawLore, capitalize, parseItemGems, removeReforge, getAverage, getMedian, getMean, getMode, toTimestamp, parseTimestamp, nth };
