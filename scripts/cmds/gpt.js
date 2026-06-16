/**
 * MKBOT Command: gpt
 * @author Charles MK
 * Chat with an AI using a free API endpoint.
 * Falls back gracefully if no API key is set.
 */

const axios = require("axios");

// Conversation memory per thread (last 5 exchanges)
const conversationHistory = new Map();

module.exports = {
  config: {
    name: "gpt",
    aliases: ["ai", "chat", "ask", "chatgpt"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Chat with AI",
    category: "ai",
    guide: "{pn} [question] — ask the AI anything\n{pn} clear — clear conversation history",
  },

  onStart: async function ({ message, args, event }) {
    const sub = (args[0] || "").toLowerCase();

    if (sub === "clear" || sub === "reset") {
      conversationHistory.delete(event.threadID);
      return message.reply("🗑️ Conversation history cleared!");
    }

    const prompt = args.join(" ").trim();
    if (!prompt) {
      return message.reply(
        "❌ Please provide a question or message.\n" +
        "Example: /gpt What is the meaning of life?"
      );
    }

    const wait = await message.reply("🤔 Thinking...");

    // Get or init conversation history
    const history = conversationHistory.get(event.threadID) || [];
    history.push({ role: "user", content: prompt });

    // Keep only last 5 exchanges (10 messages)
    const trimmed = history.slice(-10);

    try {
      // Try free API endpoint
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are MKBOT, a helpful AI assistant created by Charles MK. Keep responses concise and friendly." },
            ...trimmed,
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY || ""}`,
            "Content-Type": "application/json",
          },
          timeout: 20000,
        }
      );

      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error("Empty response");

      history.push({ role: "assistant", content: reply });
      conversationHistory.set(event.threadID, history.slice(-10));

      try { await api.unsendMessage(wait.messageID); } catch {}

      return message.reply(
        `🤖 𝗔𝗜 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💬 ${prompt}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${reply}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT AI by Charles MK`
      );
    } catch (err) {
      // Fallback: use a simple offline response
      try { await message.unsend(wait.messageID); } catch {}

      if (err.response?.status === 401 || !process.env.OPENAI_API_KEY) {
        return message.reply(
          `⚠️ AI not configured.\n` +
          `Set OPENAI_API_KEY environment variable to enable AI chat.\n` +
          `Contact the bot admin.`
        );
      }

      return message.reply(`❌ AI error: ${err.message}`);
    }
  },
};
