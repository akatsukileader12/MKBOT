/**
 * MKBOT Command: fortune
 * @author Charles MK
 * Get a random fortune cookie message.
 */

const FORTUNES = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "A dubious friend may be an enemy in camouflage.",
  "A faithful friend is a strong defense.",
  "A good time to finish up old tasks.",
  "A journey of a thousand miles begins with a single step.",
  "A smile is your passport into the hearts of others.",
  "Act boldly and unseen forces will come to your aid.",
  "Adventure can be real happiness.",
  "All the effort you are putting in will soon pay off.",
  "An exciting opportunity lies ahead of you.",
  "Be on the lookout for coming events; they cast their shadows beforehand.",
  "Change is happening in your life, so go with the flow.",
  "Dedication and persistence will bring great rewards.",
  "Do not be afraid of competition.",
  "Don't pursue happiness — create it.",
  "Every flower blooms in its own time.",
  "Every master was once a disaster.",
  "Fortune favors the bold.",
  "Good things come to those who wait, but better things come to those who hustle.",
  "Hard work pays off in the future, laziness pays off now.",
  "He who knows others is wise. He who knows himself is enlightened.",
  "Hope is the companion of power and the mother of success.",
  "If you continually give, you will continually have.",
  "In every difficulty lies an opportunity.",
  "Keep true to the dreams of your youth.",
  "Laughter is the best medicine for a long and happy life.",
  "Let your hook always be cast; in the pool where you least expect it, there will be fish.",
  "Life is the art of drawing sufficient conclusions from insufficient premises.",
  "Love is a choice you make from moment to moment.",
  "Make your life a mission, not an intermission.",
  "Many receive advice, only the wise profit from it.",
  "Now is the time to try something new.",
  "Opportunity awaits you next week, grab it.",
  "Our greatest glory is not in never failing, but in rising every time we fall.",
  "Patience is your greatest virtue.",
  "Peace of mind is found by seeking truth and doing good.",
  "Pursue your dreams with all your heart.",
  "Realize your full potential today.",
  "Rest time is not waste time.",
  "Simplicity is the ultimate sophistication.",
  "Success comes from listening to your inner voice.",
  "Take a chance! All life is a chance.",
  "The best is yet to come.",
  "The greatest risk is not taking one.",
  "The secret of getting ahead is getting started.",
  "Think outside the box to solve your current challenge.",
  "Time heals all wounds. Keep your chin up.",
  "Today will be a productive day.",
  "Trust your instincts.",
  "You are the master of your destiny.",
];

module.exports = {
  config: {
    name: "fortune",
    aliases: ["fortunecookie", "cookie"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random fortune cookie message",
    category: "fun",
    guide: "{pn} — get your fortune",
  },

  onStart: async function ({ message }) {
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    return message.reply(
      `🥠 𝗙𝗢𝗥𝗧𝗨𝗡𝗘 𝗖𝗢𝗢𝗞𝗜𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📜 "${fortune}"\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
