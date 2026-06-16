/**
 * MKBOT Command: quote
 * @author Charles MK
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "quote",
    aliases: ["inspire", "motivation"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random inspirational quote",
    category: "fun",
    guide: "{pn}",
  },

  onStart: async function ({ message }) {
    try {
      const { data } = await axios.get("https://zenquotes.io/api/random", { timeout: 8000 });
      const { q: quote, a: author } = data[0];
      message.reply(`💬 "${quote}"\n\n— ${author}`);
    } catch {
      const fallbacks = [
        { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
        { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
        { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
      ];
      const { q, a } = global.utils.random(fallbacks);
      message.reply(`💬 "${q}"\n\n— ${a}`);
    }
  },
};
