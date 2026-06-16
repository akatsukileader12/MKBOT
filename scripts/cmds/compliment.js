/**
 * MKBOT Command: compliment
 * @author Charles MK
 * Give a compliment to a user.
 */

const COMPLIMENTS = [
  "You have an incredible mind! 🧠",
  "Your positivity is contagious! ✨",
  "You make the world a better place! 🌍",
  "You're stronger than you think! 💪",
  "Your smile could light up a room! 😊",
  "You're a true inspiration to everyone around you! 🌟",
  "Your kindness knows no bounds! ❤️",
  "You're more talented than you realize! 🎨",
  "Your hard work never goes unnoticed! 🏆",
  "You have an amazing sense of humor! 😂",
  "You're genuinely one of a kind! 🦋",
  "Your perseverance is admirable! 🔥",
  "You have a great heart and an even greater soul! 💖",
  "You brighten up every room you walk into! ☀️",
  "Your dedication is truly inspiring! 🙌",
  "You're a ray of sunshine on a cloudy day! 🌤️",
  "You make hard things look easy! 🎯",
  "Your creativity is out of this world! 🚀",
  "You have such a warm and inviting personality! 🌺",
  "The world is a better place with you in it! 🌈",
];

module.exports = {
  config: {
    name: "compliment",
    aliases: ["compliments", "praise"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Give a compliment to a user",
    category: "fun",
    guide: "{pn} — compliment yourself\n{pn} @mention — compliment someone",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0];

    const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];

    if (targetID && targetID !== event.senderID) {
      const user = await usersData.get(targetID).catch(() => null);
      const name = user?.name || targetID;
      return message.reply(`💌 Hey ${name}! ${compliment}`);
    }

    const me = await usersData.get(event.senderID).catch(() => null);
    const myName = me?.name || "You";
    return message.reply(`💌 Hey ${myName}! ${compliment}`);
  },
};
