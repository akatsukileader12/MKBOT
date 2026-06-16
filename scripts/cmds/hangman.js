/**
 * MKBOT Command: hangman
 * @author Charles MK
 * Play hangman — guess the word letter by letter.
 */

const WORDS = [
  "javascript","messenger","facebook","telegram","python","programming",
  "database","algorithm","variable","function","developer","keyboard",
  "interface","bootstrap","framework","typescript","chocolate","astronaut",
  "butterfly","adventure","university","telephone","earthquake","laboratory",
  "microphone","vocabulary","electricity","government","philosophy","dictionary",
  "community","celebration","environment","technology","photography","imagination",
];

const HANGMAN_STAGES = [
  "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========",
];

module.exports = {
  config: {
    name: "hangman",
    aliases: ["hm"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play Hangman — guess the word",
    category: "game",
    guide: "{pn} — start a game, reply with letters to guess",
  },

  onStart: async function ({ message, event }) {
    const word    = WORDS[Math.floor(Math.random() * WORDS.length)];
    const letters = new Set();

    const display = () => word.split("").map(c => letters.has(c) ? c : "_").join(" ");
    const wrong   = (guessed) => [...guessed].filter(c => !word.includes(c));

    const reply = await message.reply(
      `🎮 𝗛𝗔𝗡𝗚𝗠𝗔𝗡\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `\`\`\`${HANGMAN_STAGES[0]}\`\`\`\n` +
      `Word: ${display()}\n` +
      `Wrong: none\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Reply with a letter to guess!`
    );

    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "hangman",
      state: {
        word,
        guessed: new Set(),
        senderID: event.senderID,
      },
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    const { word, guessed } = state;

    const letter = (event.body || "").trim().toLowerCase();
    if (!/^[a-z]$/.test(letter)) {
      return message.reply("❌ Reply with a single letter (a-z).");
    }

    if (guessed.has(letter)) {
      return message.reply(`⚠️ You already guessed "${letter}". Try another!`);
    }

    guessed.add(letter);
    const wrongGuesses = [...guessed].filter(c => !word.includes(c));
    const stage        = Math.min(wrongGuesses.length, 6);
    const display      = word.split("").map(c => guessed.has(c) ? c : "_").join(" ");
    const won          = word.split("").every(c => guessed.has(c));

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    if (won) {
      return message.reply(
        `🎉 𝗬𝗢𝗨 𝗪𝗢𝗡!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `✅ The word was: ${word}\n` +
        `🏆 Solved with ${wrongGuesses.length} wrong guess${wrongGuesses.length !== 1 ? "es" : ""}!`
      );
    }

    if (stage >= 6) {
      return message.reply(
        `💀 𝗚𝗔𝗠𝗘 𝗢𝗩𝗘𝗥!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `\`\`\`${HANGMAN_STAGES[6]}\`\`\`\n` +
        `😔 The word was: ${word}`
      );
    }

    const reply = await message.reply(
      `\`\`\`${HANGMAN_STAGES[stage]}\`\`\`\n` +
      `Word: ${display}\n` +
      `Wrong (${wrongGuesses.length}/6): ${wrongGuesses.join(", ") || "none"}\n` +
      `Guessed: ${[...guessed].sort().join(", ")}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Reply with a letter!`
    );

    global.GoatBot.onReply.set(reply.messageID, { commandName: "hangman", state });
  },
};
