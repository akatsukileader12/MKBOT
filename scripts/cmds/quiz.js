/**
 * MKBOT Command: quiz
 * @author Charles MK
 * General knowledge quiz via Open Trivia DB (no key needed).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "quiz",
    aliases: ["trivia"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Answer a trivia question",
    category: "game",
    guide: "{pn} — get a question, then reply with the answer number",
  },

  onStart: async function ({ message, event }) {
    try {
      const { data } = await axios.get(
        "https://opentdb.com/api.php?amount=1&type=multiple",
        { timeout: 8000 }
      );

      const q = data?.results?.[0];
      if (!q) return message.reply("❌ Could not load question. Try again!");

      // Decode HTML entities
      const decode = (str) => str
        .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"').replace(/&hellip;/g, "...");

      const question = decode(q.question);
      const correct  = decode(q.correct_answer);
      const allAnswers = [...q.incorrect_answers.map(decode), correct]
        .sort(() => Math.random() - 0.5);

      const NUMBER_EMOJIS = ["1️⃣","2️⃣","3️⃣","4️⃣"];
      const optionLines = allAnswers.map((a, i) => `${NUMBER_EMOJIS[i]} ${a}`).join("\n");
      const correctIdx  = allAnswers.indexOf(correct);

      const reply = await message.reply(
        `🧠 𝗤𝗨𝗜𝗭\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📂 Category: ${q.category}\n` +
        `⚡ Difficulty: ${q.difficulty}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `❓ ${question}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${optionLines}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Reply with the number 1-4! (30 seconds)`
      );

      global.GoatBot.onReply.set(reply.messageID, {
        commandName: "quiz",
        state: {
          correct,
          correctIdx,
          allAnswers,
          senderID: event.senderID,
          expiresAt: Date.now() + 30000,
        },
      });
    } catch (err) {
      return message.reply("❌ Quiz service unavailable. Try again later.");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;

    if (Date.now() > state.expiresAt) {
      global.GoatBot.onReply.delete(event.messageReply.messageID);
      return message.reply(`⏰ Time's up! The answer was: **${state.correct}**`);
    }

    const NUMBER_EMOJIS = ["1️⃣","2️⃣","3️⃣","4️⃣"];
    const answer = parseInt(event.body?.trim());

    if (isNaN(answer) || answer < 1 || answer > 4) {
      return message.reply("❌ Reply with a number 1-4!");
    }

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    const chosen = state.allAnswers[answer - 1];
    const isCorrect = chosen === state.correct;

    if (isCorrect) {
      // Award points
      return message.reply(
        `✅ 𝗖𝗢𝗥𝗥𝗘𝗖𝗧! 🎉\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🏆 The answer was: ${state.correct}\n` +
        `🤖 Well done!`
      );
    }

    return message.reply(
      `❌ 𝗪𝗥𝗢𝗡𝗚!\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `You chose: ${chosen}\n` +
      `✅ Correct answer: ${state.correct}\n` +
      `Better luck next time!`
    );
  },
};
