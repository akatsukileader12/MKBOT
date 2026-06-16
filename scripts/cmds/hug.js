/**
 * MKBOT Command: hug
 * @author Charles MK
 * Hug someone with an anime GIF action.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

const ACTIONS = {
  hug:  { url: "https://api.waifu.pics/sfw/hug",  msg: "hugs" },
  kiss: { url: "https://api.waifu.pics/sfw/kiss",  msg: "kisses" },
  pat:  { url: "https://api.waifu.pics/sfw/pat",   msg: "pats" },
  slap: { url: "https://api.waifu.pics/sfw/slap",  msg: "slaps" },
  bite: { url: "https://api.waifu.pics/sfw/bite",  msg: "bites" },
  poke: { url: "https://api.waifu.pics/sfw/poke",  msg: "pokes" },
  dance:{ url: "https://api.waifu.pics/sfw/dance", msg: "dances with" },
  wave: { url: "https://api.waifu.pics/sfw/wave",  msg: "waves at" },
  bonk: { url: "https://api.waifu.pics/sfw/bonk",  msg: "bonks" },
};

async function sendAction(message, usersData, senderID, targetID, actionName) {
  const action = ACTIONS[actionName];
  if (!action) return message.reply("❌ Unknown action.");

  const sender = await usersData.get(senderID).catch(() => null);
  const target = await usersData.get(targetID).catch(() => null);
  const sName  = sender?.name || senderID;
  const tName  = target?.name || targetID;

  try {
    const { data }  = await axios.get(action.url, { timeout: 8000 });
    const imgUrl    = data?.url;
    if (!imgUrl) throw new Error("No URL");

    const ext     = imgUrl.split(".").pop().split("?")[0] || "gif";
    const tmpPath = path.join(process.cwd(), "tmp", `action_${Date.now()}.${ext}`);
    fs.ensureDirSync(path.dirname(tmpPath));

    const res = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 12000 });
    await pipeline(res.data, fs.createWriteStream(tmpPath));

    await message.reply({
      body: `${sName} ${action.msg} ${tName}! 💕`,
      attachment: fs.createReadStream(tmpPath),
    });

    fs.removeSync(tmpPath);
  } catch {
    return message.reply(`💕 ${sName} ${action.msg} ${tName}!`);
  }
}

module.exports = {
  config: {
    name: "hug",
    aliases: ["kiss", "pat", "slap", "poke", "bonk", "wave", "bite", "dance"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Hug/kiss/pat/slap someone with an anime GIF",
    category: "fun",
    guide: "{pn} @mention — perform the action",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const cmdName  = event.body?.trim().split(" ")[0].replace(/^[^a-zA-Z]*/, "").toLowerCase();
    const actionName = Object.keys(ACTIONS).find(k => k === cmdName || (ACTIONS[k] && cmdName.includes(k))) || "hug";

    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0] || args[0] || event.senderID;

    if (String(targetID) === String(event.senderID) && actionName !== "dance") {
      return message.reply(`❌ You can't ${actionName} yourself! @mention someone.`);
    }

    return sendAction(message, usersData, event.senderID, targetID, actionName);
  },
};
