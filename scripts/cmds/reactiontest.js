/**
 * MKBOT Command: reactiontest
 * @author Charles MK
 * Test your reaction time — reply as fast as possible when you see GO!
 */

module.exports = {
  config: {
    name: "reactiontest",
    aliases: ["reaction", "reflex"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Test your reaction time",
    category: "game",
    guide: "{pn} — start, then reply 'go' when prompted",
  },

  onStart: async function ({ message, event }) {
    const delay = 3000 + Math.floor(Math.random() * 5000); // 3-8 sec

    const wait = await message.reply("⏳ Get ready...\nReply 'go' as fast as possible when you see the signal!");

    setTimeout(async () => {
      try {
        const go = await message.reply("🚦 𝗚𝗢𝗢𝗢𝗢𝗢! Type 'go' NOW!");
        global.GoatBot.onReply.set(go.messageID, {
          commandName: "reactiontest",
          state: { startAt: Date.now(), senderID: event.senderID },
        });
      } catch {}
    }, delay);
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    if (event.senderID !== state.senderID) return;

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    const body = (event.body || "").toLowerCase().trim();
    if (!["go", "go!", "GO"].includes(body) && body !== "go") {
      return message.reply("❌ Too early or wrong word! Wait for the GO signal.");
    }

    const elapsed = Date.now() - state.startAt;
    const grade = elapsed < 200 ? "🏆 Superhuman!" :
                  elapsed < 300 ? "⚡ Excellent!" :
                  elapsed < 500 ? "✅ Great!" :
                  elapsed < 800 ? "👍 Good" : "🐢 Slow";

    return message.reply(
      `⚡ 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡 𝗧𝗜𝗠𝗘\n━━━━━━━━━━━━━━━━━━\n` +
      `⏱️ Time: ${elapsed}ms\n` +
      `🏅 Grade: ${grade}`
    );
  },
};
