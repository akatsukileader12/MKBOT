/**
 * MKBOT Command: speedmath
 * @author Charles MK
 * Speed Math — answer math questions as fast as possible.
 */

function genQuestion(difficulty) {
  const ops = ["+", "-", "*"];
  const op  = ops[Math.floor(Math.random() * (difficulty > 1 ? 3 : 2))];
  const max = difficulty === 1 ? 20 : difficulty === 2 ? 50 : 100;
  const a   = Math.floor(Math.random() * max) + 1;
  const b   = Math.floor(Math.random() * max) + 1;
  let answer;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;
  return { question: `${a} ${op} ${b}`, answer };
}

module.exports = {
  config: {
    name: "speedmath",
    aliases: ["mathrace", "fastmath"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Answer math questions quickly for rewards",
    category: "game",
    guide: "{pn} [1/2/3] — difficulty level (default: 1)",
  },

  onStart: async function ({ message, event }) {
    const diff  = Math.min(Math.max(parseInt(event.body?.split(" ")[1]) || 1, 1), 3);
    const { question, answer } = genQuestion(diff);
    const startAt = Date.now();

    const reply = await message.reply(
      `⚡ 𝗦𝗣𝗘𝗘𝗗 𝗠𝗔𝗧𝗛 (Level ${diff})\n━━━━━━━━━━━━━━━━━━\n` +
      `❓ ${question} = ?\n━━━━━━━━━━━━━━━━━━\nYou have 15 seconds!`
    );

    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "speedmath",
      state: { answer, startAt, senderID: event.senderID },
    });
  },

  onReply: async function ({ message, event, Reply, usersData }) {
    const { state } = Reply;
    global.GoatBot.onReply.delete(event.messageReply.messageID);

    const elapsed = (Date.now() - state.startAt) / 1000;
    if (elapsed > 15) return message.reply("⏰ Too slow! Time's up.");

    const submitted = parseInt((event.body || "").trim());
    if (isNaN(submitted)) return message.reply("❌ That's not a number!");

    if (submitted === state.answer) {
      const prize = Math.max(10, Math.floor(100 / elapsed));
      const user  = await usersData.get(event.senderID);
      await usersData.set(event.senderID, { money: (user?.money || 0) + prize });
      return message.reply(`✅ Correct! ⚡ ${elapsed.toFixed(2)}s → +$${prize} earned!`);
    }
    return message.reply(`❌ Wrong! The answer was ${state.answer}.`);
  },
};
