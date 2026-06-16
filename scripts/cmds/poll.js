/**
 * MKBOT Command: poll
 * @author Charles MK
 * Create a quick poll (react-based voting via onReaction).
 */

const NUMBER_EMOJIS = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

module.exports = {
  config: {
    name: "poll",
    aliases: ["vote"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Create a poll (up to 10 options)",
    category: "utility",
    guide: "{pn} [Question] | [Option 1] | [Option 2] | ...\nExample: {pn} Favorite color? | Red | Blue | Green",
  },

  onStart: async function ({ message, args, event }) {
    const input = args.join(" ");
    const parts = input.split("|").map(s => s.trim()).filter(Boolean);

    if (parts.length < 3) {
      return message.reply(
        "❌ Usage: /poll [Question] | [Option 1] | [Option 2] | ...\n" +
        "Example: /poll Best fruit? | Apple | Mango | Banana"
      );
    }

    const question = parts[0];
    const options  = parts.slice(1).slice(0, 10);

    const optionLines = options.map((opt, i) => `${NUMBER_EMOJIS[i]} ${opt}`).join("\n");

    const pollMsg = await message.reply(
      `📊 𝗣𝗢𝗟𝗟\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `❓ ${question}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${optionLines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `React with the number to vote!\n` +
      `👤 Poll by: ${event.senderID}`
    );

    // Store poll metadata for result tracking
    global.GoatBot.onReply.set(pollMsg.messageID, {
      commandName: "poll",
      state: {
        question,
        options,
        votes: {},
        creatorID: event.senderID,
      },
    });
  },

  onReaction: async function ({ message, event, Reaction }) {
    const { state } = Reaction;
    const { options, votes, question } = state;

    const reactionEmojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
    const voteIdx = reactionEmojis.indexOf(event.reaction);

    if (voteIdx === -1 || voteIdx >= options.length) return;

    votes[event.userID] = voteIdx;

    // Tally
    const tally = options.map(() => 0);
    for (const v of Object.values(votes)) tally[v]++;
    const total = Object.keys(votes).length;

    const resultLines = options.map((opt, i) => {
      const pct  = total ? Math.round((tally[i] / total) * 100) : 0;
      const bars = Math.round(pct / 10);
      const bar  = "█".repeat(bars) + "░".repeat(10 - bars);
      return `${reactionEmojis[i]} ${opt}\n  ${bar} ${pct}% (${tally[i]})`;
    }).join("\n\n");

    return message.reply(
      `📊 𝗣𝗢𝗟𝗟 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `❓ ${question}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${resultLines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👥 Total votes: ${total}`
    );
  },
};
