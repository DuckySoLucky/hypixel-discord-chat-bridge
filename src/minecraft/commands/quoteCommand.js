const minecraftCommand = require("../../contracts/minecraftCommand.js");

class QuotesCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "quote";
    this.aliases = [];
    this.description = "Sends an inspirational quote.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
        const inspirationalQuotes = [
            "The only way to do great work is to love what you do. – Steve Jobs",
            "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
            "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
            "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
            "It does not matter how slowly you go as long as you do not stop. – Confucius",
            "You miss 100% of the shots you don’t take. – Wayne Gretzky",
            "Believe you can and you’re halfway there. – Theodore Roosevelt",
            "Act as if what you do makes a difference. It does. – William James",
            "The best time to plant a tree was 20 years ago. The second best time is now. – Chinese Proverb",
            "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
            "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
            "Opportunities don’t happen, you create them. – Chris Grosser",
            "What you get by achieving your goals is not as important as what you become by achieving your goals. – Zig Ziglar",
            "Don't be afraid to give up the good to go for the great. – John D. Rockefeller",
            "I find that the harder I work, the more luck I seem to have. – Thomas Jefferson",
            "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
            "It always seems impossible until it’s done. – Nelson Mandela",
            "Do what you can, with what you have, where you are. – Theodore Roosevelt",
            "Everything you’ve ever wanted is on the other side of fear. – George Addair",
            "We may encounter many defeats, but we must not be defeated. – Maya Angelou",
            "Success is not how high you have climbed, but how you make a positive difference to the world. – Roy T. Bennett",
            "Your limitation—it’s only your imagination.",
            "Push yourself, because no one else is going to do it for you.",
            "Great things never come from comfort zones.",
            "Dream it. Wish it. Do it.",
            "Success doesn’t just find you. You have to go out and get it."
        ];          

        const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

        this.send(`/gc ${randomQuote}`);

    } catch (error) {
        this.send(`/gc [ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = QuotesCommand;
