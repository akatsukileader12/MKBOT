/**
 * MKBOT Command: fact
 * @author Charles MK
 * Fetch a random interesting fact.
 */

const axios = require("axios");

const BACKUP_FACTS = [
  "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
  "Octopuses have three hearts, nine brains, and blue blood.",
  "A group of flamingos is called a 'flamboyance'.",
  "Bananas are technically berries, but strawberries are not.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "The Eiffel Tower can be 15 cm taller during summer due to thermal expansion.",
  "A day on Venus is longer than a year on Venus.",
  "There are more possible iterations of a game of chess than there are atoms in the observable universe.",
  "The shortest war in history lasted 38 to 45 minutes (Anglo-Zanzibar War, 1896).",
  "Crows can recognize and remember human faces.",
  "The human brain uses about 20% of the body's total energy.",
  "Water can boil and freeze at the same time — it's called the triple point.",
  "An octopus can open a jar, solve puzzles, and even play.",
  "The moon is slowly drifting away from Earth at about 3.8 cm per year.",
  "Sharks are older than trees — they've existed for over 450 million years.",
];

module.exports = {
  config: {
    name: "fact",
    aliases: ["facts", "didfact", "randomfact"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random interesting fact",
    category: "fun",
    guide: "{pn} — get a random fact",
  },

  onStart: async function ({ message }) {
    try {
      const { data } = await axios.get(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",
        { timeout: 6000 }
      );
      const factText = data?.text || BACKUP_FACTS[Math.floor(Math.random() * BACKUP_FACTS.length)];
      return message.reply(
        `💡 𝗥𝗔𝗡𝗗𝗢𝗠 𝗙𝗔𝗖𝗧\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📖 ${factText}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch {
      const fact = BACKUP_FACTS[Math.floor(Math.random() * BACKUP_FACTS.length)];
      return message.reply(
        `💡 𝗥𝗔𝗡𝗗𝗢𝗠 𝗙𝗔𝗖𝗧\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📖 ${fact}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    }
  },
};
