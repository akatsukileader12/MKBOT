/**
 * MKBOT Command: insult
 * @author Charles MK
 * Send a playful/funny insult. Always lighthearted, never actually hurtful.
 */

const INSULTS = [
  "You're the human version of a participation trophy. 🏆",
  "You're not stupid — you just have bad luck thinking. 🧠",
  "I'd agree with you but then we'd both be wrong. 😏",
  "You have the personality of a wet sock. 🧦",
  "You're proof that evolution can go in reverse. 🦧",
  "Your Wi-Fi password is the most attractive thing about you. 📶",
  "You're like a cloud — when you disappear, it's a beautiful day. ☁️",
  "You have more excuses than a dog has fleas. 🐕",
  "Your birth certificate is an apology letter from the hospital. 🏥",
  "If laughter is the best medicine, your face must be curing diseases. 😬",
  "You're like a software update — every time I see you, I think 'not now'. 💻",
  "I've seen better acting in amateur YouTube videos. 🎬",
  "You're not completely useless — you can always serve as a bad example. 📊",
  "Your secrets are safe with me. I never pay attention to boring things. 🥱",
  "You're like Monday — nobody likes you but you come around anyway. 📅",
];

module.exports = {
  config: {
    name: "insult",
    aliases: ["roast"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Send a playful insult/roast (all in good fun!)",
    category: "fun",
    guide: "{pn} — insult yourself\n{pn} @mention — roast someone (friendly!)",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0];

    const insult = INSULTS[Math.floor(Math.random() * INSULTS.length)];

    if (targetID && targetID !== event.senderID) {
      const user = await usersData.get(targetID).catch(() => null);
      const name = user?.name || targetID;
      return message.reply(`😈 Hey ${name}! ${insult}\n\n(Just kidding! 😂 All in good fun!)`);
    }

    return message.reply(`😈 ${insult}\n\n(Just kidding! 😂 All in good fun!)`);
  },
};
