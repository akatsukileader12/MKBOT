/**
 * MKBOT Command: tictactoe
 * @author Charles MK
 * Two-player tic-tac-toe in Messenger via onReply.
 */

const EMPTY = "⬜";
const X = "❌";
const O = "⭕";

function makeBoard() {
  return Array(9).fill(EMPTY);
}

function renderBoard(b) {
  return [
    `${b[0]}${b[1]}${b[2]}`,
    `${b[3]}${b[4]}${b[5]}`,
    `${b[6]}${b[7]}${b[8]}`,
  ].join("\n");
}

function checkWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,bb,c] of wins) {
    if (b[a] !== EMPTY && b[a] === b[bb] && b[bb] === b[c]) return b[a];
  }
  if (b.every(c => c !== EMPTY)) return "draw";
  return null;
}

module.exports = {
  config: {
    name: "tictactoe",
    aliases: ["ttt", "xo"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play Tic-Tac-Toe with another player",
    category: "game",
    guide: "{pn} @mention — challenge a player\nReply with 1-9 to place your mark",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions = Object.keys(event.mentions || {});
    const opponentID = mentions[0];

    if (!opponentID) {
      return message.reply(
        "❌ @mention someone to challenge!\n" +
        "Example: /ttt @Player"
      );
    }

    if (opponentID === event.senderID) {
      return message.reply("❌ You can't challenge yourself!");
    }

    const board = makeBoard();
    const players = {
      [event.senderID]: X,
      [opponentID]: O,
    };
    const names = {};
    try {
      const u1 = await usersData.get(event.senderID);
      const u2 = await usersData.get(opponentID);
      names[event.senderID] = u1?.name || "Player 1";
      names[opponentID]     = u2?.name || "Player 2";
    } catch {
      names[event.senderID] = "Player 1";
      names[opponentID]     = "Player 2";
    }

    const board_msg = await message.reply(
      `🎮 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${names[event.senderID]} (${X}) vs ${names[opponentID]} (${O})\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${renderBoard(board)}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${names[event.senderID]}'s turn! Reply 1-9:\n` +
      `1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣`
    );

    global.GoatBot.onReply.set(board_msg.messageID, {
      commandName: "tictactoe",
      state: {
        board,
        players,
        names,
        currentTurn: event.senderID,
        opponentID,
        starterID: event.senderID,
      },
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    const { board, players, names, currentTurn, opponentID, starterID } = state;

    if (event.senderID !== currentTurn) {
      return message.reply(`⏳ It's ${names[currentTurn]}'s turn!`);
    }

    const move = parseInt(event.body?.trim());
    if (isNaN(move) || move < 1 || move > 9) {
      return message.reply("❌ Reply with a number 1-9.");
    }

    const idx = move - 1;
    if (board[idx] !== EMPTY) {
      return message.reply("❌ That cell is already taken!");
    }

    board[idx] = players[currentTurn];
    const result = checkWinner(board);

    if (result) {
      global.GoatBot.onReply.delete(event.messageReply.messageID);

      if (result === "draw") {
        return message.reply(
          `🤝 𝗜𝗧'𝗦 𝗔 𝗗𝗥𝗔𝗪!\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `${renderBoard(board)}`
        );
      }

      const winnerID = Object.keys(players).find(id => players[id] === result);
      return message.reply(
        `🏆 ${names[winnerID].toUpperCase()} WINS!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${renderBoard(board)}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🎉 Congratulations ${names[winnerID]}!`
      );
    }

    const nextTurn = currentTurn === starterID ? opponentID : starterID;
    state.currentTurn = nextTurn;

    const reply = await message.reply(
      `${renderBoard(board)}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${names[nextTurn]}'s turn (${players[nextTurn]})! Reply 1-9:`
    );

    global.GoatBot.onReply.delete(event.messageReply.messageID);
    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "tictactoe",
      state,
    });
  },
};
