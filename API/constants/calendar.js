// CREDITS: https://github.com/slothpixel/core (Modified)
const { nth, parseTimestamp } = require("../functions/helper");

const months = [
  "Early Spring",
  "Spring",
  "Late Spring",
  "Early Summer",
  "Summer",
  "Late Summer",
  "Early Autumn",
  "Autumn",
  "Late Autumn",
  "Early Winter",
  "Winter",
  "Late Winter",
];

const hourMs = 50000;
const dayMs = 24 * hourMs;
const monthLength = 31;
const yearLength = months.length;

const monthMs = monthLength * dayMs;
const yearMs = yearLength * monthMs;

const yearZero = 1560275700000;

const zooStart = yearZero + yearMs * 66;
const zooTimeLength = yearMs / 2;

const pets = ["Elephant", "Giraffe", "Blue Whale", "Tiger", "Lion", "Monkey"];

function getOffset(month, day, hour = 0) {
  return months.indexOf(month) * monthLength * dayMs + (day - 1) * dayMs + hour * hourMs;
}

function timeToSkyblockYear(time) {
  return Math.floor((time - yearZero) / yearMs) + 1;
}

function getZooPet(time) {
  const iterations = Math.floor((time - zooStart) / zooTimeLength);

  return pets[iterations % pets.length];
}

function getJacobEventTimes() {
  const times = [];

  for (let month = 0; month < 12; month++) {
    let day = 2;
    while (day <= 31) {
      times.push({
        start: getOffset(months[month], day),
        end: getOffset(months[month], day),
      });

      if (day === 30) break;
      day += 3;
      if (day > 31) {
        day %= 31;
        month++;
      }
    }
  }
  return times;
}

function getDarkAuctionEventTimes() {
  const times = [];

  for (let month = 0; month < 12; month++) {
    let day = 1;
    while (day <= 31) {
      times.push({
        start: getOffset(months[month], day),
        end: getOffset(months[month], day),
      });

      if (day === 29) break;
      day += 3;
      if (day > 31) {
        day %= 31;
        month++;
      }
    }
  }
  return times;
}

function getFallenStarCultTimes() {
  const times = [];

  for (let month = 0; month < 12; month++) {
    for (let i = 1; i <= 4; i++) {
      times.push({
        start: getOffset(months[month], i * 7),
        end: getOffset(months[month], i * 7, 6),
      });
    }
  }
  return times;
}

function getUniqueListBy(array, key) {
  return [...new Map(array.map((item) => [item[key], item])).values()];
}

const eventTimes = {
  BANK_INTEREST: {
    name: "Bank Interest",
    times: [
      {
        start: getOffset("Early Spring", 1),
        end: getOffset("Early Spring", 1),
      },
      {
        start: getOffset("Early Summer", 1),
        end: getOffset("Early Summer", 1),
      },
      {
        start: getOffset("Early Autumn", 1),
        end: getOffset("Early Autumn", 1),
      },
      {
        start: getOffset("Early Winter", 1),
        end: getOffset("Early Winter", 1),
      },
    ],
  },
  DARK_AUCTION: {
    name: "Dark Auction",
    times: getDarkAuctionEventTimes(),
  },
  ELECTION_BOOTH_OPENS: {
    name: "Election Booth Opens",
    times: [
      {
        start: getOffset("Late Summer", 27),
        end: getOffset("Late Summer", 27),
      },
    ],
  },
  ELECTION_OVER: {
    name: "Election Over",
    times: [
      {
        start: getOffset("Late Spring", 27),
        end: getOffset("Late Spring", 27),
      },
    ],
  },
  FALLEN_STAR_CULT: {
    name: "Cult of the Fallen Star",
    times: getFallenStarCultTimes(),
  },
  FEAR_MONGERER: {
    name: "Fear Mongerer",
    times: [
      {
        start: getOffset("Autumn", 26),
        end: getOffset("Late Autumn", 3),
      },
    ],
  },
  JACOBS_CONTEST: {
    name: "Jacob's Farming Contest",
    times: getJacobEventTimes(),
  },
  JERRYS_WORKSHOP: {
    name: "Jerry's Workshop",
    times: [
      {
        start: getOffset("Late Winter", 1),
        end: getOffset("Late Winter", 31),
      },
    ],
  },
  NEW_YEAR_CELEBRATION: {
    name: "New Year Celebration",
    times: [
      {
        start: getOffset("Late Winter", 29),
        end: getOffset("Late Winter", 31),
      },
    ],
  },
  SEASON_OF_JERRY: {
    name: "Season of Jerry",
    times: [
      {
        start: getOffset("Late Winter", 24),
        end: getOffset("Late Winter", 26),
      },
    ],
  },
  SPOOKY_FESTIVAL: {
    name: "Spooky Festival",
    times: [
      {
        start: getOffset("Autumn", 29),
        end: getOffset("Autumn", 31),
      },
    ],
  },
  TRAVELING_ZOO: {
    name: "Traveling Zoo",
    times: [
      {
        start: getOffset("Early Summer", 1),
        end: getOffset("Early Summer", 3),
      },
      {
        start: getOffset("Early Winter", 1),
        end: getOffset("Early Winter", 3),
      },
    ],
  },
};

function buildSkyblockCalendar(events, from, to, years, stopAtYearEnd = true) {
  const now = Date.now();
  let fromDate = from || now;

  if (typeof from === "string") fromDate = parseTimestamp(from);
  fromDate = Math.max(fromDate, yearZero);

  let toDate = to || fromDate + yearMs * years || now;
  if (typeof to === "string") toDate = parseTimestamp(to);

  if (Number.isNaN(Number(fromDate)) || Number.isNaN(Number(toDate))) {
    throw new TypeError("Parameters 'from' and 'to' must be integers");
  }

  if (toDate < fromDate) throw new Error("Parameter 'to' must be greater than 'from'");

  const currentYear = Math.floor((fromDate - yearZero) / yearMs);
  const currentOffset = (fromDate - yearZero) % yearMs;

  const currentMonth = Math.floor(currentOffset / monthMs);
  const currentMonthOffset = (currentOffset - currentMonth * monthMs) % monthMs;

  const currentDay = Math.floor(currentMonthOffset / dayMs);
  const currentDayOffset = (currentMonthOffset - currentDay * dayMs) % dayMs;

  let currentHour = Math.floor(currentDayOffset / hourMs);
  const currentMinute = Math.floor(((currentDayOffset - currentHour * hourMs) / hourMs) * 60);

  const suffix = currentHour >= 12 ? "pm" : "am";

  if (currentHour > 12) currentHour -= 12;
  if (currentHour === 0) currentHour = 12;

  const formattedTime = `${currentHour}:${(Math.floor(currentMinute / 10) * 10).toString().padStart(2, "0")}${suffix}`;

  const eventList = {};

  Object.keys(eventTimes).forEach((key) => {
    eventList[key] = {
      name: "",
      duration: 0,
      events: [],
    };
  });

  // convert 'to' to years for looping
  let toToYears = Number.isNaN(Number(years)) ? timeToSkyblockYear(toDate) - currentYear : years;

  toToYears = Math.min(toToYears, 10);

  if (toToYears <= 0) throw new Error("Parameter 'years' must be positive");

  // convert string to boolean
  const stopBoolean = String(stopAtYearEnd).toLowerCase() === "true";

  if (!stopBoolean) toToYears++;

  for (let i = 0; i < toToYears; i++) {
    for (const [event, { name, times: times_ }] of Object.entries(eventTimes)) {
      const duration = times_[0].end - times_[0].start + dayMs;

      eventList[event].name = name;
      eventList[event].duration = duration;

      for (const { start: start_, end: end_ } of times_) {
        const times = {
          start: start_ + yearMs * i,
          end: end_ + yearMs * i,
        };

        /* eslint-disable-next-line no-continue */
        if (stopBoolean && times.end < currentOffset) continue;

        const msTill = times.end < currentOffset ? yearMs - currentOffset + times.start : times.start - currentOffset;

        const o = {
          start_timestamp: (Math.round(fromDate / 1000) + Math.round(msTill / 1000)) * 1000,
          end_timestamp: (Math.round(fromDate / 1000) + Math.round((msTill + duration) / 1000)) * 1000,
          starting_in: msTill,
          ending_in: msTill + duration,
        };

        if (name === "Traveling Zoo") o.pet = getZooPet(fromDate + msTill);

        eventList[event].events.push(o);
      }
    }
  }

  Object.keys(eventList).forEach((key) => {
    eventList[key].events = getUniqueListBy(eventList[key].events, "start_timestamp")
      /* eslint-disable-next-line camelcase */
      .filter(({ start_timestamp }) => start_timestamp < toDate)
      .sort((a, b) => a.start_timestamp - b.start_timestamp);
  });

  const eventsToFilter = events ? events.split(",") : Object.keys(eventTimes);

  const filteredEvents = {};
  for (const event of eventsToFilter) {
    filteredEvents[event] = eventList[event];
  }

  return {
    from: fromDate,
    to: fromDate + (yearMs - currentOffset),

    date: `${months[currentMonth]} ${nth(currentDay + 1)}, ${currentYear + 1}`,
    year: currentYear + 1,
    month: months[currentMonth],
    day: currentDay + 1,

    time: formattedTime,
    hour: currentHour,
    minute: Math.floor(currentMinute / 10) * 10,

    next_day_countdown: dayMs - currentDayOffset,
    next_month_countdown: monthMs - currentMonthOffset,
    next_year_countdown: yearMs - currentOffset,

    events: filteredEvents,
  };
}

function buildSkyblockEvents() {
  const o = {};
  Object.entries(eventTimes).forEach(([key, { name }]) => {
    o[key] = name;
  });
  return o;
}

module.exports = {
  buildSkyblockCalendar,
  buildSkyblockEvents,
};
