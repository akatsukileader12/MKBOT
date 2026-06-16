/**
 * MKBOT Command: snake
 * @author Charles MK
 * Text-based Snake game (mini version on 5x5 grid).
 */

const DIRS = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
const GRID_SIZE = 5;
const EMPTY = "⬛", SNAKE = "🟩", FOOD = "🍎", HEAD = "🟢";

function makeState() {
  const snake = [[2,2]];
  const food  = [Math.floor(Math.random()*5), Math.floor(Math.random()*5)];
  return { snake, food, dir: [1,0], score: 0 };
}

function renderGrid(state) {
  const grid = Array.from({length: GRID_SIZE}, () => Array(GRID_SIZE).fill(EMPTY));
  state.snake.slice(1).forEach(([x,y]) => { if (x>=0&&y>=0&&x<5&&y<5) grid[y][x]=SNAKE; });
  const [hx,hy] = state.snake[0];
  if (hx>=0&&hy>=0&&hx<5&&hy<5) grid[hy][hx]=HEAD;
  const [fx,fy] = state.food;
  if (grid[fy][fx]===EMPTY) grid[fy][fx]=FOOD;
  return grid.map(row => row.join("")).join("\n");
}

module.exports = {
  config: {
    name: "snake",
    aliases: ["snakegame"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play Snake on a 5x5 grid",
    category: "game",
    guide: "{pn} — start game\nReply: up/down/left/right to move",
  },
  onStart: async function ({ message, event }) {
    const state = makeState();
    const reply = await message.reply(
      `🐍 𝗦𝗡𝗔𝗞𝗘\n━━━━━━━━━━━━━━━━━━\n${renderGrid(state)}\n━━━━━━━━━━━━━━━━━━\n` +
      `Score: 0 | Reply: up/down/left/right`
    );
    global.GoatBot.onReply.set(reply.messageID, { commandName: "snake", state: { ...state, senderID: event.senderID } });
  },
  onReply: async function ({ message, event, Reply }) {
    const { state } = Reply;
    if (event.senderID !== state.senderID) return;
    const cmd = (event.body || "").toLowerCase().trim();
    const dir = DIRS[cmd];
    if (!dir) return message.reply("❌ Reply: up, down, left, or right");
    global.GoatBot.onReply.delete(event.messageReply.messageID);
    const [dx,dy] = dir;
    const [hx,hy] = state.snake[0];
    const nx = hx + dx, ny = hy + dy;
    // Wall or self collision
    if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE || state.snake.some(([x,y]) => x===nx&&y===ny)) {
      return message.reply(`💀 𝗚𝗔𝗠𝗘 𝗢𝗩𝗘𝗥!\n━━━━━━━━━━━━━━━━━━\n${renderGrid(state)}\n🏆 Final Score: ${state.score}`);
    }
    state.snake.unshift([nx, ny]);
    if (nx === state.food[0] && ny === state.food[1]) {
      state.score++;
      state.food = [Math.floor(Math.random()*GRID_SIZE), Math.floor(Math.random()*GRID_SIZE)];
    } else {
      state.snake.pop();
    }
    if (state.score >= 10) {
      return message.reply(`🏆 𝗬𝗢𝗨 𝗪𝗜𝗡!\n━━━━━━━━━━━━━━━━━━\n${renderGrid(state)}\n🎉 Score: ${state.score}`);
    }
    const r = await message.reply(`🐍 𝗦𝗡𝗔𝗞𝗘\n━━━━━━━━━━━━━━━━━━\n${renderGrid(state)}\n━━━━━━━━━━━━━━━━━━\nScore: ${state.score} | Move:`);
    global.GoatBot.onReply.set(r.messageID, { commandName: "snake", state });
  },
};
