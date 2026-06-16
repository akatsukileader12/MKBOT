/**
 * MKBOT Command: scramble
 * @author Charles MK
 * Unscramble a word game.
 */

const WORDS = [
  "javascript","messenger","python","keyboard","elephant","butterfly","chocolate","adventure",
  "astronaut","fantastic","generator","hurricane","invention","kangaroo","labyrinth","marathon",
  "nightmare","obsession","paralysis","questions","rebellion","satellite","telephone","umbrella",
  "valentine","waterfall","xylophone","yesterday","zanzibar","algorithm","beautiful","calendar",
  "dangerous","education","furniture","geography","honeybee","important","jellyfish","kilometer",
  "lightning","microscope","notebooks","orchestra","pineapple","quicksand","raspberry","skeleton",
  "thumbnail","universe","vegetable","wildlife","xenophobia","yoga","zealous","abdomen","blizzard",
  "computer","designer","enormous","fireplace","grateful","happiness","iceberg","juggernaut",
];

module.exports = {
  config: {
    name: "scramble",
    aliases: ["unscramble","wordscramble"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Unscramble the word to win",
    category: "game",
    guide: "{pn} — start game, reply with the unscrambled word",
  },
  onStart: async function ({ message, event }) {
    const word       = WORDS[Math.floor(Math.random() * WORDS.length)];
    const scrambled  = word.split("").sort(() => Math.random() - 0.5).join("").toUpperCase();
    const reply = await message.reply(
      `🔤 𝗪𝗢𝗥𝗗 𝗦𝗖𝗥𝗔𝗠𝗕𝗟𝗘\n━━━━━━━━━━━━━━━━━━\n` +
      `🔀 ${scrambled}\n━━━━━━━━━━━━━━━━━━\n` +
      `Unscramble this word! (30 seconds)\n💡 Hint: ${word.length} letters`
    );
    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "scramble",
      state: { word, expiresAt: Date.now() + 30000, senderID: event.senderID },
    });
  },
  onReply: async function ({ message, event, Reply, usersData }) {
    const { state } = Reply;
    global.GoatBot.onReply.delete(event.messageReply.messageID);
    if (Date.now() > state.expiresAt) return message.reply(`⏰ Time's up! The word was: **${state.word}**`);
    const ans = (event.body || "").toLowerCase().trim();
    if (ans === state.word) {
      const user   = await usersData.get(event.senderID);
      const earned = 50;
      await usersData.set(event.senderID, { money: (user?.money || 0) + earned });
      return message.reply(`✅ Correct! The word was "${state.word}" 🎉\n+$${earned} earned!`);
    }
    return message.reply(`❌ Wrong! The word was: **${state.word}**\nTry again with /scramble`);
  },
};
