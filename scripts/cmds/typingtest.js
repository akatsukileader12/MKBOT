/**
 * MKBOT Command: typingtest
 * @author Charles MK
 * Test your typing speed — type the given sentence.
 */

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog",
  "She sells seashells by the seashore",
  "How much wood would a woodchuck chuck",
  "The early bird catches the worm",
  "All that glitters is not gold",
  "To be or not to be that is the question",
  "Actions speak louder than words",
  "A penny saved is a penny earned",
  "Practice makes perfect in all things",
  "Every cloud has a silver lining",
];

module.exports = {
  config: {
    name: "typingtest",
    aliases: ["typetest", "wpm", "typing"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Test your typing speed in WPM",
    category: "game",
    guide: "{pn} — start a typing test, then type the sentence",
  },

  onStart: async function ({ message, event }) {
    const sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    const startAt  = Date.now();

    const reply = await message.reply(
      `⌨️ 𝗧𝗬𝗣𝗜𝗡𝗚 𝗧𝗘𝗦𝗧\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Type this sentence exactly:\n\n` +
      `📝 "${sentence}"\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⏱️ Timer starts NOW!`
    );

    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "typingtest",
      state: { sentence, startAt, senderID: event.senderID },
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;

    if (event.senderID !== state.senderID) return;

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    const elapsed = (Date.now() - state.startAt) / 1000; // seconds
    const typed   = (event.body || "").trim();

    // Accuracy check
    const target  = state.sentence;
    let correct   = 0;
    const maxLen  = Math.max(typed.length, target.length);
    for (let i = 0; i < maxLen; i++) {
      if (typed[i] === target[i]) correct++;
    }
    const accuracy = Math.round((correct / maxLen) * 100);

    const wordCount = target.split(" ").length;
    const wpm       = Math.round((wordCount / elapsed) * 60);

    const grade = wpm >= 80 ? "🏆 Expert" :
                  wpm >= 60 ? "⭐ Advanced" :
                  wpm >= 40 ? "✅ Intermediate" :
                  wpm >= 20 ? "📘 Beginner" : "🐢 Slow";

    return message.reply(
      `⌨️ 𝗧𝗬𝗣𝗜𝗡𝗚 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⏱️ Time     : ${elapsed.toFixed(2)}s\n` +
      `💨 Speed    : ${wpm} WPM\n` +
      `🎯 Accuracy : ${accuracy}%\n` +
      `🏅 Grade    : ${grade}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${typed === target ? "✅ Perfect!" : typed.toLowerCase() === target.toLowerCase() ? "⚠️ Close! (case mismatch)" : "❌ Not quite right — try again!"}`
    );
  },
};
