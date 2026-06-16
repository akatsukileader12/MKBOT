/**
 * MKBOT Command: akinator
 * @author Charles MK
 * Simple yes/no character guessing game (offline version with pre-baked characters).
 */

const CHARACTERS = [
  { name: "Naruto Uzumaki",   traits: { anime: true, male: true, ninja: true, blond: true, manga: true } },
  { name: "Goku",              traits: { anime: true, male: true, fighter: true, blond: false, manga: true } },
  { name: "Pikachu",           traits: { anime: true, male: false, animal: true, electric: true, manga: false } },
  { name: "Sherlock Holmes",   traits: { anime: false, male: true, detective: true, fictional: true, british: true } },
  { name: "Harry Potter",      traits: { anime: false, male: true, wizard: true, fictional: true, british: true } },
  { name: "Iron Man",          traits: { anime: false, male: true, superhero: true, fictional: true, tech: true } },
  { name: "Spider-Man",        traits: { anime: false, male: true, superhero: true, fictional: true, teen: true } },
  { name: "Elon Musk",         traits: { anime: false, male: true, real: true, billionaire: true, tech: true } },
  { name: "Albert Einstein",   traits: { anime: false, male: true, real: true, scientist: true, genius: true } },
  { name: "Michael Jackson",   traits: { anime: false, male: true, real: true, singer: true, famous: true } },
];

const QUESTIONS = [
  { q: "Is your character from an anime/manga?", trait: "anime" },
  { q: "Is your character male?",                trait: "male" },
  { q: "Is your character a real person?",       trait: "real" },
  { q: "Is your character a superhero?",         trait: "superhero" },
  { q: "Is your character a scientist or genius?", trait: "genius" },
  { q: "Is your character British?",             trait: "british" },
  { q: "Is your character an animal or creature?", trait: "animal" },
  { q: "Is your character a wizard or magical being?", trait: "wizard" },
  { q: "Is your character a fighter or martial artist?", trait: "fighter" },
];

module.exports = {
  config: {
    name: "akinator",
    aliases: ["aki", "genie"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Think of a character — I'll try to guess it!",
    category: "game",
    guide: "{pn} — start the game, answer yes/no questions",
  },

  onStart: async function ({ message, event }) {
    let remaining = [...CHARACTERS];
    const reply = await message.reply(
      `🧞 𝗔𝗞𝗜𝗡𝗔𝗧𝗢𝗥\n━━━━━━━━━━━━━━━━━━\n` +
      `Think of a famous character — anime, real person, superhero, anything!\n` +
      `I'll try to guess it by asking yes/no questions.\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Q1: ${QUESTIONS[0].q}\nReply: yes / no`
    );

    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "akinator",
      state: { remaining, qIdx: 0, senderID: event.senderID },
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    if (event.senderID !== state.senderID) return;

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    const ans  = (event.body || "").toLowerCase().trim();
    const isYes = ["yes","y","yeah","yep","yup","true"].includes(ans);
    const isNo  = ["no","n","nope","nah","false"].includes(ans);

    if (!isYes && !isNo) {
      const r = await message.reply(`❌ Please reply "yes" or "no".\n${QUESTIONS[state.qIdx].q}`);
      global.GoatBot.onReply.set(r.messageID, { commandName: "akinator", state });
      return;
    }

    const trait   = QUESTIONS[state.qIdx].trait;
    state.remaining = state.remaining.filter(c =>
      isYes ? c.traits[trait] === true : c.traits[trait] !== true
    );

    if (state.remaining.length === 1) {
      return message.reply(
        `🎉 𝗜 𝗚𝗨𝗘𝗦𝗦𝗘𝗗 𝗜𝗧!\n━━━━━━━━━━━━━━━━━━\n` +
        `🧞 Is it... **${state.remaining[0].name}**?\n━━━━━━━━━━━━━━━━━━\nThanks for playing!`
      );
    }

    state.qIdx++;

    if (state.qIdx >= QUESTIONS.length || state.remaining.length === 0) {
      return message.reply(
        `🤔 I couldn't figure it out!\nPossible candidates: ${state.remaining.map(c => c.name).join(", ") || "none"}\nTry again with a more well-known character!`
      );
    }

    const r = await message.reply(
      `Q${state.qIdx + 1}: ${QUESTIONS[state.qIdx].q}\n` +
      `(${state.remaining.length} candidates remaining)\nReply: yes / no`
    );
    global.GoatBot.onReply.set(r.messageID, { commandName: "akinator", state });
  },
};
