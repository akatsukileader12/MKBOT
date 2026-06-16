/**
 * MKBOT Command: ai
 * @author Charles MK
 * Uses a free AI API endpoint. Replace the URL with your preferred provider.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    aliases: ["ask", "gpt", "chat"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Ask the AI a question",
    category: "ai",
    guide: "{pn} [your question]\nExample: {pn} What is the capital of South Africa?",
  },

  onStart: async function ({ message, args, event }) {
    if (!args.length) {
      return message.reply("❌ Please ask me something!\nExample: /ai What is the capital of South Africa?");
    }

    const question = args.join(" ");
    message.react("⏳", event.messageID);

    try {
      const { data } = await axios.get(
        `https://markdevs-last-api.onrender.com/gpt4?prompt=${encodeURIComponent(question)}`,
        { timeout: 15000 }
      );

      const reply = data?.gpt4 || data?.response || data?.message || "No response received.";

      message.reply(
        `🤖 𝗠𝗢𝗕𝗢𝗧 𝗔𝗜\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `❓ ${question}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💬 ${reply}`
      );
    } catch (err) {
      message.reply(
        `❌ AI service unavailable. Please try again later.\n` +
        `(${err.message})`
      );
    }
  },
};
