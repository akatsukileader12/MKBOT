/**
 * MKBOT Command: motivate
 * @author Charles MK
 * Get an inspirational/motivational quote.
 */

const axios = require("axios");

const BACKUP_QUOTES = [
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "Success is not final, failure is not fatal: It is the courage to continue that counts.", a: "Winston Churchill" },
  { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
  { q: "Our greatest glory is not in never falling, but in rising every time we fall.", a: "Confucius" },
  { q: "Be the change you wish to see in the world.", a: "Mahatma Gandhi" },
  { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
  { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
  { q: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
];

module.exports = {
  config: {
    name: "motivate",
    aliases: ["quote2", "inspire", "inspiration", "motivation"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get an inspirational quote",
    category: "fun",
    guide: "{pn} — get a motivational quote",
  },

  onStart: async function ({ message }) {
    try {
      const { data } = await axios.get(
        "https://zenquotes.io/api/random",
        { timeout: 6000 }
      );
      const q = data?.[0];
      if (q?.q && q?.a) {
        return message.reply(
          `💪 𝗠𝗢𝗧𝗜𝗩𝗔𝗧𝗜𝗢𝗡\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `"${q.q}"\n\n` +
          `— ${q.a}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🤖 MKBOT by Charles MK`
        );
      }
    } catch {}

    const fallback = BACKUP_QUOTES[Math.floor(Math.random() * BACKUP_QUOTES.length)];
    return message.reply(
      `💪 𝗠𝗢𝗧𝗜𝗩𝗔𝗧𝗜𝗢𝗡\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `"${fallback.q}"\n\n` +
      `— ${fallback.a}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
