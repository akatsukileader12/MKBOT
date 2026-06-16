/**
 * MKBOT Command: memory
 * @author Charles MK
 * Memory card matching game (text-based).
 */

const SYMBOLS = ["🍎","🍊","🍋","🍇","🍓","🍉","🍑","🍍"];

function makeCards(pairs = 4) {
  const chosen = SYMBOLS.slice(0, pairs);
  const deck   = [...chosen, ...chosen].sort(() => Math.random() - 0.5);
  return deck;
}

function renderBoard(cards, revealed) {
  const rows = [];
  for (let i = 0; i < 8; i += 4) {
    rows.push(cards.slice(i, i+4).map((c, j) => revealed.has(i+j) ? c : "🔵").join(""));
  }
  return rows.join("\n");
}

module.exports = {
  config: {
    name: "memory",
    aliases: ["memorygame", "cardmatch"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Memory card matching game",
    category: "game",
    guide: "{pn} — start the game\nReply with two card positions (1-8) to flip",
  },
  onStart: async function ({ message, event }) {
    const cards    = makeCards(4);
    const revealed = new Set();
    const reply = await message.reply(
      `🃏 𝗠𝗘𝗠𝗢𝗥𝗬 𝗚𝗔𝗠𝗘\n━━━━━━━━━━━━━━━━━━\n${renderBoard(cards, revealed)}\n━━━━━━━━━━━━━━━━━━\n` +
      `Positions: 1️⃣2️⃣3️⃣4️⃣ / 5️⃣6️⃣7️⃣8️⃣\nReply "1 5" to flip positions 1 and 5!`
    );
    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "memory",
      state: { cards, revealed, moves: 0, senderID: event.senderID },
    });
  },
  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    if (event.senderID !== state.senderID) return;
    const parts = (event.body || "").trim().split(/\s+/);
    const a = parseInt(parts[0]) - 1, b = parseInt(parts[1]) - 1;
    if (isNaN(a) || isNaN(b) || a === b || a < 0 || b > 7 || state.revealed.has(a) || state.revealed.has(b)) {
      return message.reply("❌ Reply with two different unflipped positions (1-8).\nExample: 1 5");
    }
    global.GoatBot.onReply.delete(event.messageReply.messageID);
    state.moves++;
    const match = state.cards[a] === state.cards[b];
    if (match) state.revealed.add(a), state.revealed.add(b);
    const board = match
      ? renderBoard(state.cards, state.revealed)
      : (() => {
          const temp = new Set([...state.revealed, a, b]);
          return renderBoard(state.cards, temp);
        })();
    if (state.revealed.size === 8) {
      return message.reply(`${renderBoard(state.cards, state.revealed)}\n━━━━━━━━━━━━━━━━━━\n🎉 You matched all pairs in ${state.moves} moves!`);
    }
    const msg = match ? `✅ Match! ${state.cards[a]}` : `❌ No match! Positions ${a+1} & ${b+1}`;
    const r = await message.reply(`${board}\n━━━━━━━━━━━━━━━━━━\n${msg}\nMoves: ${state.moves} | Reply two positions:`);
    global.GoatBot.onReply.set(r.messageID, { commandName: "memory", state });
  },
};
