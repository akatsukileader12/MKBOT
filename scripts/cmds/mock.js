/**
 * MKBOT Command: mock
 * @author Charles MK
 * AlTeRnAtInG CaPs mOcKiNg tExT.
 */

function mockText(text) {
  let upper = true;
  return text.split("").map(c => {
    if (c.match(/[a-zA-Z]/)) {
      const r = upper ? c.toUpperCase() : c.toLowerCase();
      upper = !upper;
      return r;
    }
    return c;
  }).join("");
}

module.exports = {
  config: {
    name: "mock",
    aliases: ["spongebob", "alternating"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "AlTeRnAtInG CaPs text (SpongeBob meme)",
    category: "fun",
    guide: "{pn} [text] — mOcK sOmEoNe\nOr reply to a message with {pn}",
  },

  onStart: async function ({ message, args, event }) {
    let text = args.join(" ").trim();
    if (!text && event.messageReply?.body) text = event.messageReply.body.trim();
    if (!text) return message.reply("❌ Give me text to mock!\nExample: /mock I love studying");

    return message.reply(mockText(text));
  },
};
