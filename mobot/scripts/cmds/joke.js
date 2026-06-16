/**
 * MKBOT Command: joke
 * @author Charles MK
 * Fetch a random joke from JokeAPI (no key needed).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "joke",
    aliases: ["jokes", "funny"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random joke",
    category: "fun",
    guide: "{pn} — get a random joke\n{pn} [category] — programming/misc/dark/pun/spooky/christmas",
  },

  onStart: async function ({ message, args }) {
    const category = args[0] || "Any";
    const validCats = ["Any","Programming","Misc","Dark","Pun","Spooky","Christmas"];
    const cat = validCats.find(c => c.toLowerCase() === category.toLowerCase()) || "Any";

    try {
      const { data } = await axios.get(
        `https://v2.jokeapi.dev/joke/${cat}?blacklistFlags=nsfw,racist,sexist&type=single,twopart`,
        { timeout: 8000 }
      );

      let jokeText;
      if (data.type === "single") {
        jokeText = data.joke;
      } else {
        jokeText = `${data.setup}\n\n😂 ${data.delivery}`;
      }

      return message.reply(
        `😂 𝗥𝗔𝗡𝗗𝗢𝗠 𝗝𝗢𝗞𝗘\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${jokeText}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📂 Category: ${data.category}\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      const backupJokes = [
        "Why don't scientists trust atoms?\nBecause they make up everything! 😂",
        "I told my wife she was drawing her eyebrows too high.\nShe looked surprised. 😂",
        "What do you call a fake noodle?\nAn impasta! 😂",
        "Why did the scarecrow win an award?\nHe was outstanding in his field! 😂",
        "I'm reading a book about anti-gravity.\nIt's impossible to put down! 😂",
      ];
      const joke = backupJokes[Math.floor(Math.random() * backupJokes.length)];
      return message.reply(
        `😂 𝗥𝗔𝗡𝗗𝗢𝗠 𝗝𝗢𝗞𝗘\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${joke}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    }
  },
};
