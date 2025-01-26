const minecraftCommand = require("../../contracts/minecraftCommand.js");

class JokeCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "joke";
    this.aliases = [];
    this.description = "Tells a Minecraft joke.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
        const minecraftJokes = [
            "Why did the Creeper break up with the Ghast? Because it found someone a little more explosive!",
            "What do you call a sheep who can play guitar? A baa-and!",
            "Why don't skeletons fight each other? They don't have the guts!",
            "What's a Minecraft player's favorite type of music? Block and roll!",
            "Why did the Enderman bring a ladder? To reach new heights!",
            "Why did Steve go to therapy? He had too many issues with his blocks!",
            "What did the zombie say to the player? 'You're a real blockhead!'",
            "Why do pigs make terrible comedians? Their jokes are always a bit boar-ing!",
            "What did one redstone torch say to the other? 'I'm feeling a little off!'",
            "How do you make a tissue dance? You put a little boogie in it... just like a Minecraft spider!",
            "What do you call a Minecraft wizard who's always making bad decisions? A noob-ender!",
            "Why was the skeleton so calm? Because nothing gets under its skin!",
            "What do you call a snowman with a six-pack? An abdominal snowman!",
            "How do you organize a Minecraft party? You block it out!",
            "What's the hardest part about crafting a Minecraft joke? Making it *block*buster material!",
            "Why did the Minecraft chicken cross the road? To get to the other biome!",
            "What did the Minecraft player say to their friend at the crafting table? 'I'm feeling a little *pick*-y today!'",
            "Why don't Endermen ever tell jokes? Because they don't like to *look* silly!",
            "Why was the Minecraft tree so good at playing soccer? Because it had a lot of *roots* in the game!",
            "What's a Creeper's favorite type of music? Anything with a good *blast* beat!",
            "Why don't players ever tell secrets in Minecraft? Because the blocks are always *listening*!",
            "What's a Minecraft player's favorite type of bread? *Loaf*-ers!",
            "What do you call a cat that's always lazy in Minecraft? A *meow*-l! (pronounced like 'mail')",
            "Why do Minecraft players make terrible bakers? Because they can't *knead* dough!",
            "Why did the pig bring a suitcase to the game? It was ready to go on a *boar*-ing adventure!",
            "How do you know if a zombie is a good musician? It can *rock* the night away!",
            "What do you get when you cross a Creeper and a snowman? Frostbite!",
            "Why did the Minecraft chicken start a band? Because it was great at *egg*stra special performances!",
            "What did one player say to the other in Minecraft when they found diamonds? 'This is *mint*!'",
            "How do you build a house in Minecraft? With lots of *block*-ed-in ideas!",
            "Why did the Minecraft player go to the nether? To *nether* the less, they needed more resources!",
            "What's a zombie's favorite game? *Minecraft*, of course, because it's full of brains!",
            "What's Steve's favorite cereal? *Block* flakes!",
            "Why are Minecraft players always so good at math? Because they know how to *cube* things!",
            "Why did the Minecraft player break up with their sword? Because it was too *sharp* for comfort!",
            "Why did the skeleton go to the party alone? Because he had no *body* to go with!",
            "Why don't Minecraft players ever get lost? Because they always follow the *blocks* in the road!",
            "How does a Minecraft player make a decision? They *block* out all the options!",
            "What did the Creeper say when it was feeling down? 'I need some *space* to explode!'",
            "How do you cheer up a Minecraft player? Just give them a *diamond*—they'll be happy for *life*!",
            "What do you get when you combine an Enderman with a Creeper? A *teleporting explosion*!",
            "Why don't Minecraft players ever go to the beach? Because the sand always gives them *block*ed sinuses!"
          ];          
          

        const randomJoke = minecraftJokes[Math.floor(Math.random() * minecraftJokes.length)];

        this.send(`/gc ${randomJoke}`);

        } catch (error) {
            this.send(`/gc [ERROR] ${error ?? "Something went wrong.."}`);
        }
    }
}

module.exports = JokeCommand;
