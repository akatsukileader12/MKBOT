/**
 * MKBOT Command: truth
 * @author Charles MK
 * Truth or Dare — Truth questions.
 */

const TRUTHS = [
  "What is your biggest fear?",
  "What's the most embarrassing thing you've done in public?",
  "Who was your first crush?",
  "What's the most childish thing you still do?",
  "What's a secret talent you have?",
  "What's the weirdest dream you've ever had?",
  "Have you ever lied to get out of trouble? What happened?",
  "What's the most embarrassing text you've ever sent?",
  "What's the worst gift you've ever received?",
  "What's something you've done that you'd never admit in person?",
  "Who in this group do you think is the most annoying?",
  "What's the longest you've gone without a shower?",
  "Have you ever cheated on a test?",
  "What's the most selfish thing you've ever done?",
  "If you could delete one memory, what would it be?",
];

module.exports = {
  config: {
    name: "truth",
    aliases: ["tod"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a Truth or Dare question",
    category: "game",
    guide: "{pn} — get a random truth question\n{pn} dare — get a dare instead",
  },

  onStart: async function ({ message, args }) {
    const sub = (args[0] || "").toLowerCase();

    if (sub === "dare") {
      const DARES = [
        "Text someone random 'I love you' and screenshot their reply.",
        "Do your best impression of another group member.",
        "Sing the chorus of any song in a voice message.",
        "Change your profile picture to a funny one for 1 hour.",
        "Write a 5-sentence story about a banana becoming a superhero.",
        "Tell us your most embarrassing moment.",
        "Compliment everyone in this group individually.",
        "Type your next 3 messages with your elbows.",
        "Do 10 pushups right now (honor system!).",
        "Share a throwback photo in the group.",
      ];
      const dare = DARES[Math.floor(Math.random() * DARES.length)];
      return message.reply(
        `🎲 𝗗𝗔𝗥𝗘!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `😈 ${dare}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    }

    const truth = TRUTHS[Math.floor(Math.random() * TRUTHS.length)];
    return message.reply(
      `🎲 𝗧𝗥𝗨𝗧𝗛!\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🤔 ${truth}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Use /truth dare for a dare!\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
