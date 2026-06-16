/**
 * MKBOT Command: dog
 * @author Charles MK
 * Get a random dog image.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "dog",
    aliases: ["dogs", "puppy", "woof"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random dog photo",
    category: "fun",
    guide: "{pn} — random dog\n{pn} [breed] — specific breed",
  },

  onStart: async function ({ message, args }) {
    const breed = (args[0] || "").toLowerCase();

    let url;
    if (breed) {
      url = `https://dog.ceo/api/breed/${breed}/images/random`;
    } else {
      url = "https://dog.ceo/api/breeds/image/random";
    }

    const tmpPath = path.join(process.cwd(), "tmp", `dog_${Date.now()}.jpg`);
    fs.ensureDirSync(path.dirname(tmpPath));

    try {
      const { data } = await axios.get(url, { timeout: 8000 });
      const imgUrl   = data?.message;
      if (!imgUrl) throw new Error("No image");

      const res = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 10000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await message.reply({
        body: `🐶 ${breed ? breed.charAt(0).toUpperCase() + breed.slice(1) : "Random Dog"}! | MKBOT by Charles MK`,
        attachment: fs.createReadStream(tmpPath),
      });

      fs.removeSync(tmpPath);
    } catch (err) {
      try { fs.removeSync(tmpPath); } catch {}
      return message.reply(
        breed
          ? `❌ Could not find breed "${breed}". Check the breed name.\nTry: /dog labrador`
          : "❌ Could not fetch dog image. Try again!"
      );
    }
  },
};
