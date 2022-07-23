const config = require('../../../config.json')
const axios = require('axios')

if (config.event.enabled) {
    setInterval(() => {
        axios.get(`https://api.slothpixel.me/api/skyblock/calendar?to=now%2B1w`).then(response => {
            if (config.event.notifiers.BANK_INTEREST) {
                if (new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Bank Interest » ${new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.BANK_INTEREST.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.DARK_AUCTION) {
                if (new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Dark Auction » ${new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.DARK_AUCTION.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.ELECTION_BOOTH_OPENS) {
                if (new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Election Booth Opens » ${new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.ELECTION_BOOTH_OPENS.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.ELECTION_OVER) {
                if (new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Election Over » ${new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.ELECTION_OVER.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.FALLEN_STAR_CULT) {
                if (new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Cult of the Fallen Star » ${new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.FALLEN_STAR_CULT.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.FEAR_MONGERER) {
                if (new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Fear Mongerer (Spooky Fishing) » ${new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.FEAR_MONGERER.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.JACOBS_CONTEST) {
                if (new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Jacob's Farming Contest » ${new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.JACOBS_CONTEST.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.JERRYS_WORKSHOP) {
                if (new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getDay()+11 == 0 && new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getDay()+11 == 0 && new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Jerry's Workshop » ${new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.JERRYS_WORKSHOP.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.NEW_YEAR_CELEBRATION) {
                if (new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getDay()+3 == 0 && new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getDay()+3 == 0 && new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] New Year Celebration » ${new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.NEW_YEAR_CELEBRATION.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.SEASON_OF_JERRY) {
                if (new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getDay()+3 == 0 && new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getDay()+3 == 0 && new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Season of Jerry » ${new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.SEASON_OF_JERRY.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.SPOOKY_FESTIVAL) {
                if (new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getHours()-1 == 0) {
                    bot.send(`[EVENT] Spooky Festival » ${new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.SPOOKY_FESTIVAL.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
            if (config.event.notifiers.TRAVELING_ZOO) {
                if (new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getMinutes() == 5 && new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getHours()-1 == 0 || new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getMinutes() == 30 && new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getDay()-4 == 0 && new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getHours()-1 == 0) {
                    let pet = (response.data.events.TRAVELING_ZOO.events[0].pet).toLowerCase().split('_')
                    pet = `${pet[0].charAt(0).toUpperCase() + pet[0].slice(1)} ${pet[1].charAt(0).toUpperCase() + pet[1].slice(1)}`
                    bot.send(`[EVENT] Traveling Zoo (${pet})» ${new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getMinutes() > 0 ? `${new Date(response.data.events.TRAVELING_ZOO.events[0].starting_in).getMinutes()} Minutes ` : ``}`)
                }
            }
        })
    }, 60000)
}