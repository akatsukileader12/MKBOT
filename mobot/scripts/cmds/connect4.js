/**
 * MKBOT Command: connect4
 * @author Charles MK
 * Two-player Connect 4.
 */

const ROWS = 6, COLS = 7;
const EMPTY = "⬛", P1 = "🔴", P2 = "🟡";

function makeGrid() { return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY)); }

function renderGrid(grid) {
  const colNums = "1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣";
  return grid.map(row => row.join("")).join("\n") + "\n" + colNums;
}

function dropPiece(grid, col, piece) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === EMPTY) { grid[r][col] = piece; return r; }
  }
  return -1;
}

function checkWinner(grid) {
  // Horizontal
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      if (grid[r][c] !== EMPTY && [1,2,3].every(i => grid[r][c+i] === grid[r][c]))
        return grid[r][c];
  // Vertical
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c < COLS; c++)
      if (grid[r][c] !== EMPTY && [1,2,3].every(i => grid[r+i][c] === grid[r][c]))
        return grid[r][c];
  // Diagonal /
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      if (grid[r][c] !== EMPTY && [1,2,3].every(i => grid[r-i][c+i] === grid[r][c]))
        return grid[r][c];
  // Diagonal \
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++)
      if (grid[r][c] !== EMPTY && [1,2,3].every(i => grid[r+i][c+i] === grid[r][c]))
        return grid[r][c];
  return null;
}

function isFull(grid) { return grid[0].every(c => c !== EMPTY); }

module.exports = {
  config: {
    name: "connect4",
    aliases: ["c4", "connectfour"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play Connect 4 with another player",
    category: "game",
    guide: "{pn} @mention — challenge someone\nReply 1-7 to drop your piece",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions = Object.keys(event.mentions || {});
    if (!mentions[0]) return message.reply("❌ @mention someone to challenge!");
    if (mentions[0] === event.senderID) return message.reply("❌ Can't play yourself!");

    const p2 = mentions[0];
    const u1 = await usersData.get(event.senderID).catch(() => null);
    const u2 = await usersData.get(p2).catch(() => null);
    const n1 = u1?.name || "Player 1", n2 = u2?.name || "Player 2";

    const grid = makeGrid();
    const reply = await message.reply(
      `🔴🟡 𝗖𝗢𝗡𝗡𝗘𝗖𝗧 𝟰\n━━━━━━━━━━━━━━━━━━\n` +
      `${n1} (${P1}) vs ${n2} (${P2})\n━━━━━━━━━━━━━━━━━━\n` +
      `${renderGrid(grid)}\n━━━━━━━━━━━━━━━━━━\n${n1}'s turn! Reply 1-7:`
    );

    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "connect4",
      state: { grid, players: { [event.senderID]: P1, [p2]: P2 }, names: { [event.senderID]: n1, [p2]: n2 }, currentTurn: event.senderID, p2, starter: event.senderID },
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    const { grid, players, names, currentTurn, p2, starter } = state;

    if (event.senderID !== currentTurn) return message.reply(`⏳ It's ${names[currentTurn]}'s turn!`);

    const col = parseInt(event.body?.trim()) - 1;
    if (isNaN(col) || col < 0 || col > 6) return message.reply("❌ Reply 1-7.");

    const row = dropPiece(grid, col, players[currentTurn]);
    if (row === -1) return message.reply("❌ Column full!");

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    const winner = checkWinner(grid);
    if (winner) {
      const winnerID = Object.keys(players).find(id => players[id] === winner);
      return message.reply(`${renderGrid(grid)}\n━━━━━━━━━━━━━━━━━━\n🏆 ${names[winnerID]} WINS!`);
    }
    if (isFull(grid)) {
      return message.reply(`${renderGrid(grid)}\n━━━━━━━━━━━━━━━━━━\n🤝 It's a draw!`);
    }

    const next = currentTurn === starter ? p2 : starter;
    state.currentTurn = next;
    const r = await message.reply(`${renderGrid(grid)}\n━━━━━━━━━━━━━━━━━━\n${names[next]}'s turn (${players[next]})! Reply 1-7:`);
    global.GoatBot.onReply.set(r.messageID, { commandName: "connect4", state });
  },
};
