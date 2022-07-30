const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const { timeSince } = require('../../contracts/helperFunctions')
const config = require('../../../config.json')
const axios = require('axios')

if (config.event.enabled) {
    setInterval(() => {
        axios.get(`https://api.slothpixel.me/api/skyblock/calendar?to=now%2B1w`).then(async response => {
            if (config.event.notifiers.BANK_INTEREST) {
                if (timeSince(response.data.events.BANK_INTEREST.events[0].start_timestamp) == '5m' || timeSince(response.data.events.BANK_INTEREST.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Bank Interest » ${timeSince(response.data.events.BANK_INTEREST.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.DARK_AUCTION) {
                if (timeSince(response.data.events.DARK_AUCTION.events[0].start_timestamp) == '5m' || timeSince(response.data.events.DARK_AUCTION.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Dark Auction » ${timeSince(response.data.events.DARK_AUCTION.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.ELECTION_BOOTH_OPENS) {
                if (timeSince(response.data.events.ELECTION_BOOTH_OPENS.events[0].start_timestamp) == '5m' || timeSince(response.data.events.ELECTION_BOOTH_OPENS.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Election Booth Opens » ${timeSince(response.data.events.ELECTION_BOOTH_OPENS.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.ELECTION_OVER) {
                if (timeSince(response.data.events.ELECTION_OVER.events[0].start_timestamp) == '5m' || timeSince(response.data.events.ELECTION_OVER.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Election Over » ${timeSince(response.data.events.ELECTION_OVER.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.FALLEN_STAR_CULT) {
                if (timeSince(response.data.events.FALLEN_STAR_CULT.events[0].start_timestamp) == '5m' || timeSince(response.data.events.FALLEN_STAR_CULT.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Cult of the Fallen Star » ${timeSince(response.data.events.FALLEN_STAR_CULT.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.FEAR_MONGERER) {
                if (timeSince(response.data.events.FEAR_MONGERER.events[0].start_timestamp) == '5m' || timeSince(response.data.events.FEAR_MONGERER.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Fear Mongerer (Spooky Fishing) » ${timeSince(response.data.events.FEAR_MONGERER.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.JACOBS_CONTEST) {
                if (timeSince(response.data.events.JACOBS_CONTEST.events[0].start_timestamp) == '5m' || timeSince(response.data.events.JACOBS_CONTEST.events[0].start_timestamp) == '30m') {
                    axios.get('https://dawjaw.net/jacobs').then(async jacobContest => {
                        for (let i = 0; i < jacobContest.data.length; i++) {
                            if (jacobContest.data[i].time == parseFloat((response.data.events.JACOBS_CONTEST.events[0].start_timestamp/1000).toFixed(2))) {
                                bot.chat(`/gc [EVENT] Jacob's Farming Contest (${jacobContest.data[i].crops[0] + ', ' + jacobContest.data[i].crops[1] + ' & ' + jacobContest.data[i].crops[2]}) » ${timeSince(response.data.events.JACOBS_CONTEST.events[0].start_timestamp)}`)
                                break;
                            }
                        }
                        await delay(1000) 
                    })    
                }
            }
            if (config.event.notifiers.JERRYS_WORKSHOP) {
                if (timeSince(response.data.events.JERRYS_WORKSHOP.events[0].start_timestamp) == '5m' || timeSince(response.data.events.JERRYS_WORKSHOP.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Jerry's Workshop » ${timeSince(response.data.events.JERRYS_WORKSHOP.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.NEW_YEAR_CELEBRATION) {
                if (timeSince(response.data.events.NEW_YEAR_CELEBRATION.events[0].start_timestamp) == '5m' || timeSince(response.data.events.NEW_YEAR_CELEBRATION.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] New Year Celebration » ${timeSince(response.data.events.NEW_YEAR_CELEBRATION.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.SEASON_OF_JERRY) {
                if (timeSince(response.data.events.SEASON_OF_JERRY.events[0].start_timestamp) == '5m' || timeSince(response.data.events.SEASON_OF_JERRY.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Season of Jerry » ${timeSince(response.data.events.SEASON_OF_JERRY.events[0].start_timestamp)}}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.SPOOKY_FESTIVAL) {
                if (timeSince(response.data.events.SPOOKY_FESTIVAL.events[0].start_timestamp) == '5m' || timeSince(response.data.events.SPOOKY_FESTIVAL.events[0].start_timestamp) == '30m') {
                    bot.chat(`/gc [EVENT] Spooky Festival » ${timeSince(response.data.events.SPOOKY_FESTIVAL.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
            if (config.event.notifiers.TRAVELING_ZOO) {
                if (timeSince(response.data.events.TRAVELING_ZOO.events[0].start_timestamp) == '5m' || timeSince(response.data.events.TRAVELING_ZOO.events[0].start_timestamp) == '30m' ) {
                    let pet = (response.data.events.TRAVELING_ZOO.events[0].pet).toLowerCase().split('_')
                    bot.chat(`/gc [EVENT] Traveling Zoo (${pet})» ${timeSince(response.data.events.TRAVELING_ZOO.events[0].start_timestamp)}`)
                    await delay(1000) 
                }
            }
        })
    }, 60000)
}