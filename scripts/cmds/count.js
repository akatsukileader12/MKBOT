/**
 * MKBOT Command: count
 * @author Charles MK
 * Group counting game — count up from 1 without the same user posting twice in a row.
 */

module.exports = {
  config: {
    name: "count",
    aliases: ["counting"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Counting game — count up together as a group",
    category: "game",
    guide: "{pn} start — start counting from 1\n{pn} stop — end the game\n{pn} status — current count",
  },
  onStart: async function ({ message, args, event, threadsData }) {
    const sub = (args[0] || "").toLowerCase();
    const thread = await threadsData.get(event.threadID);

    if (sub === "stop" || sub === "end") {
      await threadsData.set(event.threadID, { countGame: null });
      return message.reply("🛑 Counting game ended.");
    }
    if (sub === "status") {
      const game = thread?.countGame;
      if (!game) return message.reply("ℹ️ No counting game active. Use /count start");
      return message.reply(`🔢 Current count: ${game.current}\n👤 Last: ${game.lastUser || "none"}\n🏆 High: ${game.highScore || 0}`);
    }
    // Start or restart
    const game = { current: 0, lastUser: null, highScore: thread?.countGame?.highScore || 0 };
    await threadsData.set(event.threadID, { countGame: game });
    return message.reply(`🔢 𝗖𝗢𝗨𝗡𝗧𝗜𝗡𝗚 𝗚𝗔𝗠𝗘 𝗦𝗧𝗔𝗥𝗧𝗘𝗗!\n━━━━━━━━━━━━━━━━━━\nType "1" to begin counting!\nRules: No same person twice in a row!`);
  },

  onChat: async function ({ event, message, threadsData }) {
    if (!event.body) return;
    const thread = await threadsData.get(event.threadID);
    const game   = thread?.countGame;
    if (!game) return;

    const num = parseInt(event.body.trim());
    if (isNaN(num)) return;

    const expected = game.current + 1;
    if (num !== expected) {
      await threadsData.set(event.threadID, { countGame: { current: 0, lastUser: null, highScore: game.highScore || 0 } });
      return message.reply(`❌ ${event.senderID} ruined it! Expected ${expected}, got ${num}.\n🔄 Starting over... Type "1" to begin again!\n🏆 High score: ${game.highScore}`);
    }
    if (game.lastUser === event.senderID) {
      await threadsData.set(event.threadID, { countGame: { current: 0, lastUser: null, highScore: game.highScore || 0 } });
      return message.reply(`❌ Same person twice! ${event.senderID} broke the chain!\n🔄 Starting over...\n🏆 High score: ${game.highScore}`);
    }

    const newHigh = Math.max(game.highScore || 0, num);
    await threadsData.set(event.threadID, { countGame: { current: num, lastUser: event.senderID, highScore: newHigh } });

    if (num % 50 === 0) {
      return message.reply(`🎉 ${num}! Amazing! Keep going!`);
    }
  },
};
