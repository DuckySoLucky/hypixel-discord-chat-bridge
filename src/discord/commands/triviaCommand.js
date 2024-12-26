const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: 'sbtrivia',
  description: 'Plays a Skyblock trivia game!',
  options: [],
  execute: async (interaction) => {
    try {
      // Check if interaction is already replied or deferred
      if (!interaction.replied && !interaction.deferred) {
        await interaction.deferReply({ ephemeral: true }); // Defer reply to allow time
      }

      // Notify user the game is starting
      await interaction.editReply({
        content: 'Starting the trivia game! Check the channel for your question.',
      });

      // Start trivia game
      await playTrivia(interaction.channel, interaction.user);
    } catch (error) {
      console.error('Error handling interaction:', error);

      // Fallback: If the interaction hasn't been replied, send an error message
      if (!interaction.replied) {
        await interaction.reply({
          content: 'An error occurred while starting the trivia game. Please try again later.',
          ephemeral: true,
        });
      }
    }
  },
};

async function playTrivia(channel, user) {
    const triviaQuestions = [
        {
            question: "Who is the final boss of Floor 7 in Hypixel Skyblock dungeons?",
            options: ["1. Necron", "2. Sadan", "3. Maxor", "4. Goldor"],
            answer: 1,
        },
        {
            question: "Which item is crafted using Diamante's Handles?",
            options: ["1. Hyperion", "2. Valkyrie", "3. Shadow Assassin Chestplate", "4. Flower of Truth"],
            answer: 2,
        },
        {
            question: "What is the reward for defeating the Livid boss?",
            options: ["1. Adaptive Armor", "2. Shadow Assassin Armor", "3. Spirit Bow", "4. Bonzo's Staff"],
            answer: 2,
        },
        {
            question: "Which dungeon floor introduces the Spirit Sceptre?",
            options: ["1. Floor 1", "2. Floor 3", "3. Floor 4", "4. Floor 5"],
            answer: 3,
        },
        {
          question: "What is the name of the dungeon hub NPC who gives daily quests?",
          options: ["1. Ophelia", "2. Mort", "3. Malik", "4. Elizabeth"],
          answer: 2,
      },
      {
          question: "Which material is used to craft the Flower of Truth?",
          options: ["1. Enchanted Poppy", "2. Enchanted Dandelion", "3. Enchanted Rose", "4. Enchanted Bone"],
          answer: 3,
      },
      {
          question: "What is the ability of the Hyperion?",
          options: ["1. Implosion", "2. Wither Shield", "3. Seismic Wave", "4. Ragnarok"],
          answer: 1,
      },
      {
          question: "Which dungeon boss drops the Giant's Sword?",
          options: ["1. Necron", "2. Sadan", "3. Livid", "4. Thorn"],
          answer: 2,
      },
      {
          question: "What is the maximum catacombs level in Hypixel Skyblock?",
          options: ["1. 30", "2. 40", "3. 50", "4. 60"],
          answer: 3,
      },
      {
          question: "Which dungeon class specializes in healing?",
          options: ["1. Tank", "2. Healer", "3. Mage", "4. Berserk"],
          answer: 2,
      },
      {
          question: "What does the Spirit Bow do?",
          options: ["1. Shoots healing arrows", "2. Summons mobs", "3. Shoots through walls", "4. Damages Thorn during the boss fight"],
          answer: 4,
      },
      {
          question: "Which NPC in the dungeon hub reforges items?",
          options: ["1. Mort", "2. Malik", "3. Ophelia", "4. Elizabeth"],
          answer: 2,
      },
      {
          question: "What is the cooldown of the Bonzo Staff ability?",
          options: ["1. 0.5 seconds", "2. 1 second", "3. 2 seconds", "4. 3 seconds"],
          answer: 2,
      },
      {
          question: "Which class is known for ranged attacks?",
          options: ["1. Tank", "2. Mage", "3. Archer", "4. Healer"],
          answer: 3,
      },
      {
          question: "What is the name of the NPC who sells dungeon gear?",
          options: ["1. Malik", "2. Mort", "3. Ophelia", "4. Elizabeth"],
          answer: 3,
      },
      {
        question: "What is the cost of a Booster Cookie from the Community Shop?",
        options: ["1. 325 Gems", "2. 400 Gems", "3. 500 Gems", "4. 600 Gems"],
        answer: 1, // 325 Gems
      },
      {
        question: "Which NPC upgrades minion storage?",
        options: ["1. Jerry", "2. Kat", "3. Elizabeth", "4. None of the above"],
        answer: 3, // Elizabeth
      },
      {
        question: "What is the crafting material for a Midas' Staff?",
        options: ["1. Gold Blocks", "2. Enchanted Gold", "3. Enchanted Gold Blocks", "4. Enchanted Iron Blocks"],
        answer: 3, // Enchanted Gold Blocks
      },
      {
        question: "What is the default maximum island size?",
        options: ["1. 120x120", "2. 160x160", "3. 240x240", "4. 320x320"],
        answer: 2, // 160x160
      },
      {
        question: "What ability does the Scylla sword have?",
        options: ["1. Implosion", "2. Wither Shield", "3. Seismic Wave", "4. True Damage"],
        answer: 2, // Wither Shield
      },
      {
        question: "How many coins does a Slayer quest cost to start at level 3?",
        options: ["1. 5,000", "2. 10,000", "3. 15,000", "4. 20,000"],
        answer: 2, // 10,000
      },
      {
        question: "Which of these is not a dungeon potion effect?",
        options: ["1. Speed", "2. Strength", "3. Agility", "4. Health"],
        answer: 3, // Agility
      },
      {
        question: "What is the name of the Wither armor upgraded to Necron's Armor?",
        options: ["1. Goldor's Armor", "2. Wither Armor", "3. Maxor's Armor", "4. Shadow Assassin"],
        answer: 2, // Wither Armor
      },
      {
        question: "What pet increases combat wisdom by 30?",
        options: ["1. Ender Dragon", "2. Griffin", "3. Mithril Golem", "4. Wolf"],
        answer: 4, // Wolf
      },
      {
        question: "What is the name of the NPC that sells the Flower Minion?",
        options: ["1. Rosetta", "2. Shania", "3. Tomioka", "4. Anita"],
        answer: 4, // Anita
      },
      {
        question: "How many Fairy Souls are there in total?",
        options: ["1. 193", "2. 204", "3. 211", "4. 234"],
        answer: 2, // 204
      },
      {
        question: "What is the base damage of the Livid Dagger?",
        options: ["1. 150", "2. 160", "3. 175", "4. 200"],
        answer: 1, // 150
      },
      {
        question: "What is the ability of the Aspect of the End sword?",
        options: ["1. Teleport", "2. Fire Beam", "3. Damage Over Time", "4. Lifesteal"],
        answer: 1, // Teleport
      },
      {
        question: "What reforge increases critical chance the most?",
        options: ["1. Spicy", "2. Fabled", "3. Sharp", "4. Precise"],
        answer: 3, // Sharp
      },
      {
        question: "How much mana does the Ink Wand ability cost?",
        options: ["1. 50", "2. 100", "3. 150", "4. 200"],
        answer: 4, // 200
      },
      {
        question: "What is the cooldown of the Jerry-chine Gun?",
        options: ["1. None", "2. 1 second", "3. 0.5 seconds", "4. 0.2 seconds"],
        answer: 4, // 0.2 seconds
      },
      ];

  // Delete any existing messages before starting
  let previousMessages = await channel.messages.fetch({ limit: 5 }); // Fetch last 5 messages (adjust as needed)
  previousMessages = previousMessages.filter(msg => msg.author.bot); // Filter out non-bot messages
  await Promise.all(previousMessages.map(msg => msg.delete())); // Delete bot messages

  const randomQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

  const questionEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('🧠 Dungeon Trivia!')
    .setDescription(randomQuestion.question)
    .addFields(randomQuestion.options.map((option, index) => ({
      name: `Option ${index + 1}`,
      value: option,
    })))
    .setFooter({ text: 'Reply with the number of your answer.' });

  // Send trivia question to the channel
  const questionMessage = await channel.send({ embeds: [questionEmbed] });

  const filter = (msg) => msg.author.id === user.id;
  const collector = channel.createMessageCollector({ filter, time: 30000 });

  collector.on('collect', async (msg) => {
    const answer = parseInt(msg.content, 10);

    if (!isNaN(answer) && answer >= 1 && answer <= randomQuestion.options.length) {
      collector.stop();

      const correctEmbed = new EmbedBuilder()
        .setColor(answer === randomQuestion.answer ? '#00ff00' : '#ff0000')
        .setTitle(answer === randomQuestion.answer ? '🎉 Correct!' : '❌ Incorrect!')
        .setDescription(
          answer === randomQuestion.answer
            ? 'Well done!'
            : `The correct answer was: ${randomQuestion.options[randomQuestion.answer - 1]}`
        );

      // Delete the trivia question message after a 3-second delay
      setTimeout(() => {
        questionMessage.delete();
      }, 3000);

      const correctMessage = await channel.send({ embeds: [correctEmbed] });

      const playAgainEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Play Again?')
        .setDescription('Reply with `yes` to play again or `no` to stop.');

      // Send and delete the play-again message after 3 seconds
      const playAgainMessage = await channel.send({ embeds: [playAgainEmbed] });

      const playAgainCollector = channel.createMessageCollector({ filter, time: 10000 }); // Timeout after 10 seconds

      playAgainCollector.on('collect', async (response) => {
        const lowerResponse = response.content.toLowerCase();

        if (lowerResponse === 'yes') {
          playAgainCollector.stop();
          await playTrivia(channel, user); // Recursive call for replay
        } else if (lowerResponse === 'no') {
          playAgainCollector.stop();
          const goodbyeEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Goodbye!')
            .setDescription('Thanks for playing!');

          await channel.send({ embeds: [goodbyeEmbed] });
        } else {
          await channel.send('Please reply with either `yes` or `no`.');
        }

        // Delete the play-again message after a 3-second delay
        setTimeout(() => {
          playAgainMessage.delete();
        }, 3000);
      });

      playAgainCollector.on('end', async (_, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('⏰ Time\'s up!')
            .setDescription('You didn\'t reply in time.');

          await channel.send({ embeds: [timeoutEmbed] });

          // Delete the play-again message after a 3-second delay
          setTimeout(() => {
            playAgainMessage.delete();
          }, 3000);
        }
      });

      // Delete the correct message after a 3-second delay
      setTimeout(() => {
        correctMessage.delete();
      }, 3000);
    } else {
      await channel.send('Please reply with a valid option number.');
    }
  });

  collector.on('end', async (_, reason) => {
    if (reason === 'time') {
      const timeoutEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('⏰ Time\'s up!')
        .setDescription('You didn\'t reply in time.');

      // Delete the timeout message after a 3-second delay
      setTimeout(() => {
        channel.send({ embeds: [timeoutEmbed] });
      }, 3000);
    }
  });
}

//CODED BY Mr_Bear_First !!
//Made into a discord version by XoticTK (with help from chatgpt because im tired and did NOT feel like doin allat)