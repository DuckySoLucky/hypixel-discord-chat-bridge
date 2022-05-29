const MinecraftCommand = require('../../contracts/MinecraftCommand')
const hypixel = require('../../contracts/Hypixel')
const axios = require('axios');

process.on('uncaughtException', function (err) {
	console.log(err.stack);
  });
  
class DuelsStatsCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'duels'
		this.aliases = ['duel']
		this.description = 'Duel stats of specified user.'
	}
  
	async onCommand(username, message) {
		let arg = this.getArgs(message);
		let temp = this;
		let duels = ['blitz','Blitz','UHC','uhc','Parkour','parkour','Boxing','boxing','bowspleef','Bowspleef','spleef','Spleef','Arena,','arena','megawalls','MegaWalls','Megawalls','op','OP','sumo','Sumo','Classic','classic','combo','Combo','bridge','Bridge','Nodebuff','nodebuff','bow','Bow']
		
		if (arg[0] == undefined && arg[1] == undefined) { // !duels
			hypixel.getPlayer(username).then(player => {
				temp.send(`/gc [Duels] [${player.stats.duels.division}] ${username} Wins: ${player.stats.duels.wins} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`)	
			}).catch(e => {
				console.error(e);
				this.send(e);
			});
		}

		else if (duels.includes(arg[0]))
			hypixel.getPlayer(username).then(player => {
				if (arg[0] === undefined) {
					temp.send(`/gc [Duels] [${player.stats.duels.division}] ${username} Wins: ${player.stats.duels.wins} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`)
				} else {
					if (arg[0] == username) {
						temp.send(`/gc [Duels] [${player.stats.duels.division}] ${username} Wins: ${player.stats.duels.wins} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`)
					} else if (arg[0] == 'blitz' || arg[0] == 'Blitz') { // Blitz Duel
						if (arg[1] == undefined) {temp.send(`/gc [Blitz] [${player.stats.duels.blitz.division}] ${username} Wins: ${player.stats.duels.blitz.wins} | CWS: ${player.stats.duels.blitz.winstreak} | BWS: ${player.stats.duels.blitz.bestWinstreak} | WLR: ${player.stats.duels.blitz.WLRatio}`)}
						else {temp.send(`/gc [Blitz] [${player.stats.duels.blitz.division}] ${username} Wins: ${player.stats.duels.blitz.wins} | CWS: ${player.stats.duels.blitz.winstreak} | BWS: ${player.stats.duels.blitz.bestWinstreak} | WLR: ${player.stats.duels.blitz.WLRatio}`)}
					} else if (arg[0] == 'uhc' || arg[0] == 'UHC') { // UHC duel
						if (arg[1] == undefined) {temp.send(`/gc [UHC] [${player.stats.duels.uhc.overall.division}] ${username} Wins: ${player.stats.duels.uhc.overall.wins} | CWS: ${player.stats.duels.uhc.overall.winstreak} | BWS: ${player.stats.duels.uhc.overall.bestWinstreak} | WLR: ${player.stats.duels.uhc.overall.WLRatio}`)}
						 else {temp.send(`/gc [UHC] [${player.stats.duels.uhc.overall.division}] ${username} Wins: ${player.stats.duels.uhc.overall.wins} | CWS: ${player.stats.duels.uhc.overall.winstreak} | BWS: ${player.stats.duels.uhc.overall.bestWinstreak} | WLR: ${player.stats.duels.uhc.overall.WLRatio}`)}
					} else if (arg[0] == 'parkour' || arg[0] == 'Parkour') { // Parkour Duel
						if (arg[1] == undefined) {temp.send(`/gc [Parkour] [${player.stats.duels.parkour.division}] ${username} Wins: ${player.stats.duels.parkour.wins} | CWS: ${player.stats.duels.parkour.winstreak} | BWS: ${player.stats.duels.parkour.bestWinstreak} | WLR: ${player.stats.duels.parkour.WLRatio}`)}
						else {temp.send(`/gc [Parkour] [${player.stats.duels.parkour.division}] ${username} Wins: ${player.stats.duels.parkour.wins} | CWS: ${player.stats.duels.parkour.winstreak} | BWS: ${player.stats.duels.parkour.bestWinstreak} | WLR: ${player.stats.duels.parkour.WLRatio}`)}
					} else if (arg[0] == 'boxing' || arg[0] == 'Boxing') { // Boxing Duel
						if (arg[1] == undefined) {temp.send(`/gc [Boxing] [${player.stats.duels.boxing.division}] ${username} Wins: ${player.stats.duels.boxing.wins} | CWS: ${player.stats.duels.boxing.winstreak} | BWS: ${player.stats.duels.boxing.bestWinstreak} | WLR: ${player.stats.duels.boxing.WLRatio}`)}
						else {temp.send(`/gc [Boxing] [${player.stats.duels.boxing.division}] ${username} Wins: ${player.stats.duels.boxing.wins} | CWS: ${player.stats.duels.boxing.winstreak} | BWS: ${player.stats.duels.boxing.bestWinstreak} | WLR: ${player.stats.duels.boxing.WLRatio}`)}
					} else if (arg[0] == 'bowspleef' || arg[0] == 'Bowspleef' || arg[0] == 'spleef' || arg[0] == 'Spleef') { // Bow Spleef Duel
						if (arg[1] == undefined) {temp.send(`/gc [Bowspleef] [${player.stats.duels.bowspleef.division}] ${username} Wins: ${player.stats.duels.bowspleef.wins} | CWS: ${player.stats.duels.bowspleef.winstreak} | BWS: ${player.stats.duels.bowspleef.bestWinstreak} | WLR: ${player.stats.duels.bowspleef.WLRatio}`)}
						else {temp.send(`/gc [Bowspleef] [${player.stats.duels.bowspleef.division}] ${username} Wins: ${player.stats.duels.bowspleef.wins} | CWS: ${player.stats.duels.bowspleef.winstreak} | BWS: ${player.stats.duels.bowspleef.bestWinstreak} | WLR: ${player.stats.duels.bowspleef.WLRatio}`)}
					} else if (arg[0] == 'arena' || arg[0] == 'Arena') { // Arena Duel
						if (arg[1] == undefined) {temp.send(`/gc [Arena] [${player.stats.duels.arena.division}] ${username} Wins: ${player.stats.duels.arena.wins} | CWS: ${player.stats.duels.arena.winstreak} | BWS: ${player.stats.duels.arena.bestWinstreak} | WLR: ${player.stats.duels.arena.WLRatio}`)}
						else {temp.send(`/gc [Arena] [${player.stats.duels.arena.division}] ${username} Wins: ${player.stats.duels.arena.wins} | CWS: ${player.stats.duels.arena.winstreak} | BWS: ${player.stats.duels.arena.bestWinstreak} | WLR: ${player.stats.duels.arena.WLRatio}`)}
					} else if (arg[0] == 'megawalls' || arg[0] == 'MegaWalls' || arg[0] == 'Megawalls') { // Megawalls Duel
						if (arg[1] == undefined) {temp.send(`/gc [MegaWalls] [${player.stats.duels.megawalls.division}] ${username} Wins: ${player.stats.duels.megawalls.wins} | CWS: ${player.stats.duels.megawalls.winstreak} | BWS: ${player.stats.duels.megawalls.bestWinstreak} | WLR: ${player.stats.duels.megawalls.WLRatio}`)}
						else {temp.send(`/gc [MegaWalls] [${player.stats.duels.megawalls.division}] ${username} Wins: ${player.stats.duels.megawalls.wins} | CWS: ${player.stats.duels.megawalls.winstreak} | BWS: ${player.stats.duels.megawalls.bestWinstreak} | WLR: ${player.stats.duels.megawalls.WLRatio}`)}
					} else if (arg[0] == 'op' || arg[0] == 'Op' || arg[0] == 'OP') { // OP Duel
						if (arg[1] == undefined) {temp.send(`/gc [OP] [${player.stats.duels.op.overall.division}] ${username} Wins: ${player.stats.duels.op.overall.wins} | CWS: ${player.stats.duels.op.overall.winstreak} | BWS: ${player.stats.duels.op.overall.bestWinstreak} | WLR: ${player.stats.duels.op.overall.WLRatio}`)}
						else {temp.send(`/gc [OP] [${player.stats.duels.op.overall.division}] ${username} Wins: ${player.stats.duels.op.overall.wins} | CWS: ${player.stats.duels.op.overall.winstreak} | BWS: ${player.stats.duels.op.overall.bestWinstreak} | WLR: ${player.stats.duels.op.overall.WLRatio}`)}
					} else if (arg[0] == 'sumo' || arg[0] == 'Sumo') { // Sumo Duel
						if (arg[1] == undefined) {temp.send(`/gc [Sumo] [${player.stats.duels.sumo.division}] ${username} Wins: ${player.stats.duels.sumo.wins} | CWS: ${player.stats.duels.sumo.winstreak} | BWS: ${player.stats.duels.sumo.bestWinstreak} | WLR: ${player.stats.duels.sumo.WLRatio}`)}
						else {temp.send(`/gc [Sumo] [${player.stats.duels.sumo.division}] ${username} Wins: ${player.stats.duels.sumo.wins} | CWS: ${player.stats.duels.sumo.winstreak} | BWS: ${player.stats.duels.sumo.bestWinstreak} | WLR: ${player.stats.duels.sumo.WLRatio}`)}
					} else if (arg[0] == 'classic' || arg[0] == 'Classic') { // Classic Duel
						if (arg[1] == undefined) {temp.send(`/gc [Classic] [${player.stats.duels.classic.division}] ${username} Wins: ${player.stats.duels.classic.wins} | CWS: ${player.stats.duels.classic.winstreak} | BWS: ${player.stats.duels.classic.bestWinstreak} | WLR: ${player.stats.duels.classic.WLRatio}`)}
						else {temp.send(`/gc [Classic] [${player.stats.duels.classic.division}] ${username} Wins: ${player.stats.duels.classic.wins} | CWS: ${player.stats.duels.classic.winstreak} | BWS: ${player.stats.duels.classic.bestWinstreak} | WLR: ${player.stats.duels.classic.WLRatio}`)}
					} else if (arg[0] == 'combo' || arg[0] == 'Combo') { // Combo Duel
						if (arg[1] == undefined) {temp.send(`/gc [Combo] [${player.stats.duels.combo.division}] ${username} Wins: ${player.stats.duels.combo.wins} | CWS: ${player.stats.duels.combo.winstreak} | BWS: ${player.stats.duels.combo.bestWinstreak} | WLR: ${player.stats.duels.combo.WLRatio}`)}
						else {temp.send(`/gc [Combo] [${player.stats.duels.combo.division}] ${username} Wins: ${player.stats.duels.combo.wins} | CWS: ${player.stats.duels.combo.winstreak} | BWS: ${player.stats.duels.combo.bestWinstreak} | WLR: ${player.stats.duels.combo.WLRatio}`)}
					} else if (arg[0] == 'bridge' || arg[0] == 'Bridge') { // Bridge Duel
						if (arg[1] == undefined) {temp.send(`/gc [Bridge] [${player.stats.duels.bridge.overall.division}] ${username} Wins: ${player.stats.duels.bridge.overall.wins} | CWS: ${player.stats.duels.bridge.overall.winstreak} | BWS: ${player.stats.duels.bridge.overall.bestWinstreak} | WLR: ${player.stats.duels.bridge.overall.WLRatio}`)}
						else {temp.send(`/gc [Bridge] [${player.stats.duels.bridge.overall.division}] ${username} Wins: ${player.stats.duels.bridge.overall.wins} | CWS: ${player.stats.duels.bridge.overall.winstreak} | BWS: ${player.stats.duels.bridge.overall.bestWinstreak} | WLR: ${player.stats.duels.bridge.overall.WLRatio}`)}
					} else if (arg[0] == 'nodebuff' || arg[0] == 'Nodebuff') { // Nodebuff Duel
						if (arg[1] == undefined) {temp.send(`/gc [Nodebuff] [${player.stats.duels.nodebuff.division}] ${username} Wins: ${player.stats.duels.nodebuff.wins} | CWS: ${player.stats.duels.nodebuff.winstreak} | BWS: ${player.stats.duels.nodebuff.bestWinstreak} | WLR: ${player.stats.duels.nodebuff.WLRatio}`)}
						else {temp.send(`/gc [Nodebuff] [${player.stats.duels.nodebuff.division}] ${username} Wins: ${player.stats.duels.nodebuff.wins} | CWS: ${player.stats.duels.nodebuff.winstreak} | BWS: ${player.stats.duels.nodebuff.bestWinstreak} | WLR: ${player.stats.duels.nodebuff.WLRatio}`)}
					} else if (arg[0] == 'bow' || arg[0] == 'Bow') { // Bow Duel
						if (arg[1] == undefined) {temp.send(`/gc [Bow] [${player.stats.duels.bow.division}] ${username} Wins: ${player.stats.duels.bow.wins} | CWS: ${player.stats.duels.bow.winstreak} | BWS: ${player.stats.duels.bow.bestWinstreak} | WLR: ${player.stats.duels.bow.WLRatio}`)}
						else {temp.send(`/gc [Bow] [${player.stats.duels.bow.division}] ${username} Wins: ${player.stats.duels.bow.wins} | CWS: ${player.stats.duels.bow.winstreak} | BWS: ${player.stats.duels.bow.bestWinstreak} | WLR: ${player.stats.duels.bow.WLRatio}`)}
					}
				} 	
			}).catch(e => {
				console.error(e);
				this.send(e);
			});
		else {
			if (!duels.includes(arg[0])) {
				username = arg[0]
			} else if (!duels.includes(arg[1])) {
				username = arg[1]
			}
			hypixel.getPlayer(username).then(player => {
				if (arg[0] === undefined) {
					temp.send(`/gc [Duels] [${player.stats.duels.division}] ${username} Wins: ${player.stats.duels.wins} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`)
				} else {
					if (arg[0] == username) {
						temp.send(`/gc [Duels] [${player.stats.duels.division}] ${username} Wins: ${player.stats.duels.wins} | CWS: ${player.stats.duels.winstreak} | BWS: ${player.stats.duels.bestWinstreak} | WLR: ${player.stats.duels.WLRatio}`)
					} else if (arg[0] == 'blitz' || arg[0] == 'Blitz') { // Blitz Duel
						if (arg[1] == undefined) {temp.send(`/gc [Blitz] [${player.stats.duels.blitz.division}] ${username} Wins: ${player.stats.duels.blitz.wins} | CWS: ${player.stats.duels.blitz.winstreak} | BWS: ${player.stats.duels.blitz.bestWinstreak} | WLR: ${player.stats.duels.blitz.WLRatio}`)}
						else {temp.send(`/gc [Blitz] [${player.stats.duels.blitz.division}] ${username} Wins: ${player.stats.duels.blitz.wins} | CWS: ${player.stats.duels.blitz.winstreak} | BWS: ${player.stats.duels.blitz.bestWinstreak} | WLR: ${player.stats.duels.blitz.WLRatio}`)}
					} else if (arg[0] == 'uhc' || arg[0] == 'UHC') { // UHC duel
						if (arg[1] == undefined) {temp.send(`/gc [UHC] [${player.stats.duels.uhc.overall.division}] ${username} Wins: ${player.stats.duels.uhc.overall.wins} | CWS: ${player.stats.duels.uhc.overall.winstreak} | BWS: ${player.stats.duels.uhc.overall.bestWinstreak} | WLR: ${player.stats.duels.uhc.overall.WLRatio}`)}
						 else {temp.send(`/gc [UHC] [${player.stats.duels.uhc.overall.division}] ${username} Wins: ${player.stats.duels.uhc.overall.wins} | CWS: ${player.stats.duels.uhc.overall.winstreak} | BWS: ${player.stats.duels.uhc.overall.bestWinstreak} | WLR: ${player.stats.duels.uhc.overall.WLRatio}`)}
					} else if (arg[0] == 'parkour' || arg[0] == 'Parkour') { // Parkour Duel
						if (arg[1] == undefined) {temp.send(`/gc [Parkour] [${player.stats.duels.parkour.division}] ${username} Wins: ${player.stats.duels.parkour.wins} | CWS: ${player.stats.duels.parkour.winstreak} | BWS: ${player.stats.duels.parkour.bestWinstreak} | WLR: ${player.stats.duels.parkour.WLRatio}`)}
						else {temp.send(`/gc [Parkour] [${player.stats.duels.parkour.division}] ${username} Wins: ${player.stats.duels.parkour.wins} | CWS: ${player.stats.duels.parkour.winstreak} | BWS: ${player.stats.duels.parkour.bestWinstreak} | WLR: ${player.stats.duels.parkour.WLRatio}`)}
					} else if (arg[0] == 'boxing' || arg[0] == 'Boxing') { // Boxing Duel
						if (arg[1] == undefined) {temp.send(`/gc [Boxing] [${player.stats.duels.boxing.division}] ${username} Wins: ${player.stats.duels.boxing.wins} | CWS: ${player.stats.duels.boxing.winstreak} | BWS: ${player.stats.duels.boxing.bestWinstreak} | WLR: ${player.stats.duels.boxing.WLRatio}`)}
						else {temp.send(`/gc [Boxing] [${player.stats.duels.boxing.division}] ${username} Wins: ${player.stats.duels.boxing.wins} | CWS: ${player.stats.duels.boxing.winstreak} | BWS: ${player.stats.duels.boxing.bestWinstreak} | WLR: ${player.stats.duels.boxing.WLRatio}`)}
					} else if (arg[0] == 'bowspleef' || arg[0] == 'Bowspleef' || arg[0] == 'spleef' || arg[0] == 'Spleef') { // Bow Spleef Duel
						if (arg[1] == undefined) {temp.send(`/gc [Bowspleef] [${player.stats.duels.bowspleef.division}] ${username} Wins: ${player.stats.duels.bowspleef.wins} | CWS: ${player.stats.duels.bowspleef.winstreak} | BWS: ${player.stats.duels.bowspleef.bestWinstreak} | WLR: ${player.stats.duels.bowspleef.WLRatio}`)}
						else {temp.send(`/gc [Bowspleef] [${player.stats.duels.bowspleef.division}] ${username} Wins: ${player.stats.duels.bowspleef.wins} | CWS: ${player.stats.duels.bowspleef.winstreak} | BWS: ${player.stats.duels.bowspleef.bestWinstreak} | WLR: ${player.stats.duels.bowspleef.WLRatio}`)}
					} else if (arg[0] == 'arena' || arg[0] == 'Arena') { // Arena Duel
						if (arg[1] == undefined) {temp.send(`/gc [Arena] [${player.stats.duels.arena.division}] ${username} Wins: ${player.stats.duels.arena.wins} | CWS: ${player.stats.duels.arena.winstreak} | BWS: ${player.stats.duels.arena.bestWinstreak} | WLR: ${player.stats.duels.arena.WLRatio}`)}
						else {temp.send(`/gc [Arena] [${player.stats.duels.arena.division}] ${username} Wins: ${player.stats.duels.arena.wins} | CWS: ${player.stats.duels.arena.winstreak} | BWS: ${player.stats.duels.arena.bestWinstreak} | WLR: ${player.stats.duels.arena.WLRatio}`)}
					} else if (arg[0] == 'megawalls' || arg[0] == 'MegaWalls' || arg[0] == 'Megawalls') { // Megawalls Duel
						if (arg[1] == undefined) {temp.send(`/gc [MegaWalls] [${player.stats.duels.megawalls.division}] ${username} Wins: ${player.stats.duels.megawalls.wins} | CWS: ${player.stats.duels.megawalls.winstreak} | BWS: ${player.stats.duels.megawalls.bestWinstreak} | WLR: ${player.stats.duels.megawalls.WLRatio}`)}
						else {temp.send(`/gc [MegaWalls] [${player.stats.duels.megawalls.division}] ${username} Wins: ${player.stats.duels.megawalls.wins} | CWS: ${player.stats.duels.megawalls.winstreak} | BWS: ${player.stats.duels.megawalls.bestWinstreak} | WLR: ${player.stats.duels.megawalls.WLRatio}`)}
					} else if (arg[0] == 'op' || arg[0] == 'Op' || arg[0] == 'OP') { // OP Duel
						if (arg[1] == undefined) {temp.send(`/gc [OP] [${player.stats.duels.op.overall.division}] ${username} Wins: ${player.stats.duels.op.overall.wins} | CWS: ${player.stats.duels.op.overall.winstreak} | BWS: ${player.stats.duels.op.overall.bestWinstreak} | WLR: ${player.stats.duels.op.overall.WLRatio}`)}
						else {temp.send(`/gc [OP] [${player.stats.duels.op.overall.division}] ${username} Wins: ${player.stats.duels.op.overall.wins} | CWS: ${player.stats.duels.op.overall.winstreak} | BWS: ${player.stats.duels.op.overall.bestWinstreak} | WLR: ${player.stats.duels.op.overall.WLRatio}`)}
					} else if (arg[0] == 'sumo' || arg[0] == 'Sumo') { // Sumo Duel
						if (arg[1] == undefined) {temp.send(`/gc [Sumo] [${player.stats.duels.sumo.division}] ${username} Wins: ${player.stats.duels.sumo.wins} | CWS: ${player.stats.duels.sumo.winstreak} | BWS: ${player.stats.duels.sumo.bestWinstreak} | WLR: ${player.stats.duels.sumo.WLRatio}`)}
						else {temp.send(`/gc [Sumo] [${player.stats.duels.sumo.division}] ${username} Wins: ${player.stats.duels.sumo.wins} | CWS: ${player.stats.duels.sumo.winstreak} | BWS: ${player.stats.duels.sumo.bestWinstreak} | WLR: ${player.stats.duels.sumo.WLRatio}`)}
					} else if (arg[0] == 'classic' || arg[0] == 'Classic') { // Classic Duel
						if (arg[1] == undefined) {temp.send(`/gc [Classic] [${player.stats.duels.classic.division}] ${username} Wins: ${player.stats.duels.classic.wins} | CWS: ${player.stats.duels.classic.winstreak} | BWS: ${player.stats.duels.classic.bestWinstreak} | WLR: ${player.stats.duels.classic.WLRatio}`)}
						else {temp.send(`/gc [Classic] [${player.stats.duels.classic.division}] ${username} Wins: ${player.stats.duels.classic.wins} | CWS: ${player.stats.duels.classic.winstreak} | BWS: ${player.stats.duels.classic.bestWinstreak} | WLR: ${player.stats.duels.classic.WLRatio}`)}
					} else if (arg[0] == 'combo' || arg[0] == 'Combo') { // Combo Duel
						if (arg[1] == undefined) {temp.send(`/gc [Combo] [${player.stats.duels.combo.division}] ${username} Wins: ${player.stats.duels.combo.wins} | CWS: ${player.stats.duels.combo.winstreak} | BWS: ${player.stats.duels.combo.bestWinstreak} | WLR: ${player.stats.duels.combo.WLRatio}`)}
						else {temp.send(`/gc [Combo] [${player.stats.duels.combo.division}] ${username} Wins: ${player.stats.duels.combo.wins} | CWS: ${player.stats.duels.combo.winstreak} | BWS: ${player.stats.duels.combo.bestWinstreak} | WLR: ${player.stats.duels.combo.WLRatio}`)}
					} else if (arg[0] == 'bridge' || arg[0] == 'Bridge') { // Bridge Duel
						if (arg[1] == undefined) {temp.send(`/gc [Bridge] [${player.stats.duels.bridge.overall.division}] ${username} Wins: ${player.stats.duels.bridge.overall.wins} | CWS: ${player.stats.duels.bridge.overall.winstreak} | BWS: ${player.stats.duels.bridge.overall.bestWinstreak} | WLR: ${player.stats.duels.bridge.overall.WLRatio}`)}
						else {temp.send(`/gc [Bridge] [${player.stats.duels.bridge.overall.division}] ${username} Wins: ${player.stats.duels.bridge.overall.wins} | CWS: ${player.stats.duels.bridge.overall.winstreak} | BWS: ${player.stats.duels.bridge.overall.bestWinstreak} | WLR: ${player.stats.duels.bridge.overall.WLRatio}`)}
					} else if (arg[0] == 'nodebuff' || arg[0] == 'Nodebuff') { // Nodebuff Duel
						if (arg[1] == undefined) {temp.send(`/gc [Nodebuff] [${player.stats.duels.nodebuff.division}] ${username} Wins: ${player.stats.duels.nodebuff.wins} | CWS: ${player.stats.duels.nodebuff.winstreak} | BWS: ${player.stats.duels.nodebuff.bestWinstreak} | WLR: ${player.stats.duels.nodebuff.WLRatio}`)}
						else {temp.send(`/gc [Nodebuff] [${player.stats.duels.nodebuff.division}] ${username} Wins: ${player.stats.duels.nodebuff.wins} | CWS: ${player.stats.duels.nodebuff.winstreak} | BWS: ${player.stats.duels.nodebuff.bestWinstreak} | WLR: ${player.stats.duels.nodebuff.WLRatio}`)}
					} else if (arg[0] == 'bow' || arg[0] == 'Bow') { // Bow Duel
						if (arg[1] == undefined) {temp.send(`/gc [Bow] [${player.stats.duels.bow.division}] ${username} Wins: ${player.stats.duels.bow.wins} | CWS: ${player.stats.duels.bow.winstreak} | BWS: ${player.stats.duels.bow.bestWinstreak} | WLR: ${player.stats.duels.bow.WLRatio}`)}
						else {temp.send(`/gc [Bow] [${player.stats.duels.bow.division}] ${username} Wins: ${player.stats.duels.bow.wins} | CWS: ${player.stats.duels.bow.winstreak} | BWS: ${player.stats.duels.bow.bestWinstreak} | WLR: ${player.stats.duels.bow.WLRatio}`)}
					}
				} 	
			}).catch(e => {
				console.error(e);
				this.send(e);
			});

		}
	}
}
  

module.exports = DuelsStatsCommand
