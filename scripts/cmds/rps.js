/**
 * MKBOT Command: rps
 * @author Charles MK
 * Rock, Paper, Scissors vs the bot.
 */

const CHOICES = { rock: "🪨", paper: "📄", scissors: "✂️" };
const WINS_AGAINST = { rock: "scissors", paper: "rock", scissors: "paper" };

module.exports = {
  config: {
    name: "rps",
    aliases: ["rockpaperscissors"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play Rock Paper Scissors vs the bot",
    category: "game",
    guide: "{pn} [rock/paper/scissors]",
  },

  onStart: async function ({ message, args }) {
    const choice = (args[0] || "").toLowerCase();
    const valid  = ["rock", "paper", "scissors"];

    if (!valid.includes(choice)) {
      return message.reply(
        "❌ Choose: rock, paper, or scissors\n" +
        "Example: /rps rock"
      );
    }

    const botChoice = valid[Math.floor(Math.random() * 3)];
    const userEmoji = CHOICES[choice];
    const botEmoji  = CHOICES[botChoice];

    let result;
    if (choice === botChoice)                result = "draw";
    else if (WINS_AGAINST[choice] === botChoice) result = "win";
    else                                     result = "lose";

    const resultMsg = {
      win:  "🏆 You WIN! Well played!",
      lose: "😔 You lose! Better luck next time!",
      draw: "🤝 It's a DRAW!",
    }[result];

    return message.reply(
      `✊ 𝗥𝗢𝗖𝗞 𝗣𝗔𝗣𝗘𝗥 𝗦𝗖𝗜𝗦𝗦𝗢𝗥𝗦\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 You : ${userEmoji} ${choice}\n` +
      `🤖 Bot : ${botEmoji} ${botChoice}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${resultMsg}`
    );
  },
};
