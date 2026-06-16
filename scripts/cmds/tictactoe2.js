/**
 * MKBOT Command: ttt2
 * @author Charles MK
 * Tic-Tac-Toe vs the Bot (AI opponent using minimax).
 */

const EMPTY = "⬜", X = "❌", O = "⭕";

function makeBoard() { return Array(9).fill(EMPTY); }
function renderBoard(b) {
  return [`${b[0]}${b[1]}${b[2]}`, `${b[3]}${b[4]}${b[5]}`, `${b[6]}${b[7]}${b[8]}`].join("\n");
}
function checkWinner(b) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,bb,c] of wins) if (b[a] !== EMPTY && b[a] === b[bb] && b[bb] === b[c]) return b[a];
  if (b.every(c => c !== EMPTY)) return "draw";
  return null;
}
function minimax(board, isMax) {
  const w = checkWinner(board);
  if (w === O) return 10;
  if (w === X) return -10;
  if (w === "draw") return 0;
  const scores = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === EMPTY) {
      board[i] = isMax ? O : X;
      scores.push(minimax(board, !isMax));
      board[i] = EMPTY;
    }
  }
  return isMax ? Math.max(...scores) : Math.min(...scores);
}
function bestMove(board) {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === EMPTY) {
      board[i] = O;
      const score = minimax(board, false);
      board[i] = EMPTY;
      if (score > best) { best = score; move = i; }
    }
  }
  return move;
}

module.exports = {
  config: {
    name: "ttt2",
    aliases: ["tttbot", "xovs"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Tic-Tac-Toe vs the bot (AI)",
    category: "game",
    guide: "{pn} — play vs the bot\nReply 1-9 to place your mark",
  },
  onStart: async function ({ message, event }) {
    const board = makeBoard();
    const reply = await message.reply(
      `🤖 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘 (vs Bot)\n━━━━━━━━━━━━━━━━━━\n${renderBoard(board)}\n━━━━━━━━━━━━━━━━━━\n` +
      `You are ${X}, bot is ${O}\nReply 1-9:\n1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣`
    );
    global.GoatBot.onReply.set(reply.messageID, { commandName: "ttt2", state: { board, senderID: event.senderID } });
  },
  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    if (event.senderID !== state.senderID) return;
    const move = parseInt(event.body?.trim()) - 1;
    if (isNaN(move) || move < 0 || move > 8 || state.board[move] !== EMPTY) {
      return message.reply("❌ Invalid move. Reply 1-9 for an empty cell.");
    }
    state.board[move] = X;
    global.GoatBot.onReply.delete(event.messageReply.messageID);
    let result = checkWinner(state.board);
    if (!result) {
      const botMove = bestMove(state.board);
      state.board[botMove] = O;
      result = checkWinner(state.board);
    }
    if (result) {
      const msg = result === "draw" ? "🤝 Draw!" : result === X ? "🏆 You WIN!" : "🤖 Bot wins!";
      return message.reply(`${renderBoard(state.board)}\n━━━━━━━━━━━━━━━━━━\n${msg}`);
    }
    const r = await message.reply(`${renderBoard(state.board)}\n━━━━━━━━━━━━━━━━━━\nYour turn (${X})! Reply 1-9:`);
    global.GoatBot.onReply.set(r.messageID, { commandName: "ttt2", state });
  },
};
