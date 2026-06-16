/**
 * MKBOT Command: numberguess
 * @author Charles MK
 * Guess a number between 1 and 100 with hints.
 */

module.exports = {
  config: {
    name: "numberguess",
    aliases: ["guess", "numguess"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Guess a number between 1-100",
    category: "game",
    guide: "{pn} — start a game, then reply with your guess",
  },

  onStart: async function ({ message, event }) {
    const secret = Math.floor(Math.random() * 100) + 1;

    const reply = await message.reply(
      `🎲 𝗡𝗨𝗠𝗕𝗘𝗥 𝗚𝗨𝗘𝗦𝗦\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `I'm thinking of a number between 1 and 100!\n` +
      `You have 7 attempts. Reply with your guess!\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💡 Good luck!`
    );

    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "numberguess",
      state: {
        secret,
        attempts: 0,
        maxAttempts: 7,
        senderID: event.senderID,
      },
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    const { secret, maxAttempts } = state;

    if (event.senderID !== state.senderID) {
      return message.reply("⚠️ This isn't your game!");
    }

    const guess = parseInt(event.body?.trim());
    if (isNaN(guess) || guess < 1 || guess > 100) {
      return message.reply("❌ Enter a number between 1 and 100!");
    }

    state.attempts++;
    const remaining = maxAttempts - state.attempts;

    if (guess === secret) {
      global.GoatBot.onReply.delete(event.messageReply.messageID);
      return message.reply(
        `🎉 𝗖𝗢𝗥𝗥𝗘𝗖𝗧!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `✅ The number was ${secret}!\n` +
        `🏆 You got it in ${state.attempts} attempt${state.attempts > 1 ? "s" : ""}!`
      );
    }

    if (state.attempts >= maxAttempts) {
      global.GoatBot.onReply.delete(event.messageReply.messageID);
      return message.reply(
        `💀 𝗚𝗔𝗠𝗘 𝗢𝗩𝗘𝗥\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `😔 You ran out of attempts!\n` +
        `🔢 The number was: ${secret}`
      );
    }

    const hint = guess < secret ? "📈 Too LOW!" : "📉 Too HIGH!";
    const reply = await message.reply(
      `${hint}\n` +
      `🔢 You guessed: ${guess}\n` +
      `🎯 Attempts: ${state.attempts}/${maxAttempts} (${remaining} left)`
    );

    global.GoatBot.onReply.delete(event.messageReply.messageID);
    global.GoatBot.onReply.set(reply.messageID, { commandName: "numberguess", state });
  },
};
