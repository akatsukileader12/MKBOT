/**
 * MKBOT Command: wordle
 * @author Charles MK
 * Wordle-style word guessing game.
 */

const axios = require("axios");

const WORDS_5 = [
  "about","above","abuse","actor","acute","admit","adopt","adult","after","again",
  "agent","agree","ahead","alarm","album","alert","alike","align","alive","alley",
  "allow","alone","along","alter","angel","anger","angle","angry","anime","ankle",
  "annex","apart","apple","apply","arena","argue","arise","armor","array","aside",
  "asset","avoid","awake","aware","awful","badly","baker","basic","basis","beach",
  "beard","beast","began","begin","being","below","bench","berry","birth","black",
  "blade","blame","bland","blank","blast","blaze","bleed","blend","bless","blind",
  "block","blood","blown","board","boost","booth","bound","brain","brand","brave",
  "break","breed","brick","brief","bring","broke","brown","build","built","bunny",
  "burst","buyer","cabin","cable","candy","carry","catch","cause","chain","chair",
  "cheap","check","chess","child","china","chips","choke","chunk","civic","civil",
  "claim","clash","class","clean","clear","click","cliff","climb","clock","clone",
  "close","cloud","coach","coast","coral","crack","craft","crane","crash","crazy",
  "cream","creek","crime","cross","crowd","crown","cruel","crush","curve","cycle",
];

const EMOJI = { correct: "🟩", present: "🟨", absent: "⬛" };

function score(guess, target) {
  const result = Array(5).fill("absent");
  const tArr   = target.split("");
  const used   = Array(5).fill(false);

  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guess[i] === tArr[i]) { result[i] = "correct"; used[i] = true; }
  }
  // Second pass: present
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === tArr[j]) {
        result[i] = "present"; used[j] = true; break;
      }
    }
  }
  return result;
}

module.exports = {
  config: {
    name: "wordle",
    aliases: ["wordguess"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play Wordle — guess the 5-letter word in 6 tries",
    category: "game",
    guide: "{pn} — start a game, then reply with 5-letter words",
  },

  onStart: async function ({ message, event }) {
    const word  = WORDS_5[Math.floor(Math.random() * WORDS_5.length)];
    const reply = await message.reply(
      `🟩 𝗪𝗢𝗥𝗗𝗟𝗘\n━━━━━━━━━━━━━━━━━━\n` +
      `Guess the 5-letter word! You have 6 tries.\n` +
      `🟩 = correct spot  🟨 = wrong spot  ⬛ = not in word\n` +
      `━━━━━━━━━━━━━━━━━━\nReply with a 5-letter word!`
    );
    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "wordle",
      state: { word, guesses: [], senderID: event.senderID },
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    const guess = (event.body || "").toLowerCase().trim();

    if (event.senderID !== state.senderID) return;
    if (guess.length !== 5 || !/^[a-z]+$/.test(guess)) {
      return message.reply("❌ Enter a valid 5-letter word.");
    }

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    const result = score(guess, state.word);
    const row    = guess.split("").map((c, i) => EMOJI[result[i]] + c.toUpperCase()).join("");
    state.guesses.push({ guess, result, row });

    const board   = state.guesses.map(g => g.row).join("\n");
    const correct = result.every(r => r === "correct");
    const maxed   = state.guesses.length >= 6;

    if (correct) {
      return message.reply(`${board}\n━━━━━━━━━━━━━━━━━━\n🎉 Correct! The word was "${state.word.toUpperCase()}"!\nSolved in ${state.guesses.length}/6 tries!`);
    }
    if (maxed) {
      return message.reply(`${board}\n━━━━━━━━━━━━━━━━━━\n😔 Game over! The word was "${state.word.toUpperCase()}".`);
    }

    const remaining = 6 - state.guesses.length;
    const r = await message.reply(`${board}\n━━━━━━━━━━━━━━━━━━\n${remaining} tries left! Guess again:`);
    global.GoatBot.onReply.set(r.messageID, { commandName: "wordle", state });
  },
};
