const axios = require('axios');
const minecraftCommand = require("../../contracts/minecraftCommand.js");

class RandomSongCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "randomsong";
        this.aliases = ["rs"];
        this.description = "Get a random song from a specific Deezer playlist.";
        this.options = [];
    }

    async onCommand() {
        try {
            // Get a playlist
            const response = await axios.get('https://api.deezer.com/playlist/3155776842');
            const songs = response.data.tracks.data;

            // Get a random song from the playlist
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            const songName = randomSong.title;
            const songArtist = randomSong.artist.name;

            // Send the song name and artist to the chat
            this.send(`/gc Song : ${songName} by ${songArtist}`);
        } catch (error) {
            this.send(`/gc [ERROR] ${error}`);
        }
    }
}

module.exports = RandomSongCommand;