/**
 * MKBOT Command: memes
 * @author Charles MK
 * Fetch a random meme from Reddit/Meme API.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

const SUBREDDITS = ["memes", "dankmemes", "me_irl", "AdviceAnimals", "funny", "programmerhumor"];

module.exports = {
  config: {
    name: "memes",
    aliases: ["meme", "randommeme"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random meme",
    category: "fun",
    guide: "{pn} — random meme\n{pn} [subreddit] — meme from specific subreddit",
  },

  onStart: async function ({ message, args }) {
    const sub = args[0] || SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];

    try {
      const { data } = await axios.get(
        `https://meme-api.com/gimme/${encodeURIComponent(sub)}`,
        { timeout: 10000 }
      );

      if (!data?.url || data.nsfw) {
        return message.reply("❌ Couldn't find a meme right now. Try again!");
      }

      const imgUrl  = data.url;
      const tmpPath = path.join(process.cwd(), "tmp", `meme_${Date.now()}.jpg`);
      fs.ensureDirSync(path.dirname(tmpPath));

      const res = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 15000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await message.reply({
        body: `😂 ${data.title}\n👍 ${data.ups} upvotes | r/${data.subreddit}`,
        attachment: fs.createReadStream(tmpPath),
      });

      fs.removeSync(tmpPath);
    } catch (err) {
      return message.reply("❌ Failed to fetch meme. Try again later!");
    }
  },
};
