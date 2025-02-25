const { getRandomWord, scrambleWord } = require("../constants/words.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");

/**
 * Returns the word
 * @param {string} message
 * @returns {string}
 */
const getWord = (message) => message.split(" ").pop() ?? "";

/**
 * Returns the username
 * @param {string} message
 * @returns {string | null}
 */
const getUsername = (message) => {
  const match = message.match(/^(?:(?:\[(?<rank>[^\]]+)\] )?(?:(?<username>\w+)(?: \[(?<guildRank>[^\]]+)\])?: )?)?(?<message>.+)$/);

  if (!match?.groups) {
    return null;
  }

  return match.groups.username;
};

const cooldowns = new Map();

class unscrambleCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "unscramble";
    this.aliases = ["unscramble", "unscrambleme", "unscrambleme", "us"];
    this.description = "Unscramble the word and type it in chat to win!";
    this.options = [
      {
        name: "length",
        description: "Length of the word to unscramble",
        required: false
      }
    ];
    this.cooldown = 30 * 1000;
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const length = this.getArgs(message)[0];
      const answer = getRandomWord(length);
      const scrambledWord = scrambleWord(answer);

      const cooldownDuration = this.cooldown;

      if (cooldowns.has(this.name)) {
        const lastTime = cooldowns.get(this.name);
        const elapsedTime = Date.now() - lastTime;
        const remainingTime = cooldownDuration - elapsedTime;

        if (remainingTime > 0) {
          return this.send(`Please wait until current game is over.`);
        }
      }

      let answered = false;
      cooldowns.set(this.name, Date.now());
      /**
       * Listener for chat event
       * @param {string} username
       * @param {string} message
       */
      const listener = (username, message) => {
        if (getWord(message) === answer) {
          this.send(`${getUsername(message)} guessed it right! Time elapsed: ${(Date.now() - startTime).toLocaleString()}ms!`);
          bot.removeListener("chat", listener);
          answered = true;
          cooldowns.delete(this.name);
        }
      };

      bot.on("chat", listener);
      this.send(`Unscramble the following word: "${scrambledWord}"`);
      const startTime = Date.now();

      setTimeout(() => {
        bot.removeListener("chat", listener);
        cooldowns.delete(this.name);

        if (answered === false) {
          this.send(`Time's up! The answer was ${answer}`);
        }
      }, 30000);
    } catch (error) {
      this.send(`[ERROR] ${error || "Something went wrong.."}`);
    }
  }
}

module.exports = unscrambleCommand;
