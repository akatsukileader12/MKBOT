/**
 * MKBOT Command: encode
 * @author Charles MK
 * Encode/decode text in various formats.
 */

module.exports = {
  config: {
    name: "encode",
    aliases: ["decode", "base64", "binary"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Encode or decode text (base64, binary, hex, morse)",
    category: "utility",
    guide: [
      "{pn} base64 [text]    — encode to base64",
      "{pn} unbase64 [text]  — decode from base64",
      "{pn} hex [text]       — encode to hex",
      "{pn} unhex [text]     — decode from hex",
      "{pn} binary [text]    — encode to binary",
      "{pn} reverse [text]   — reverse text",
    ].join("\n"),
  },

  onStart: async function ({ message, args }) {
    const sub  = (args[0] || "").toLowerCase();
    const text = args.slice(1).join(" ");

    if (!sub || !text) {
      return message.reply(
        "❌ Usage: /encode [method] [text]\n" +
        "Methods: base64, unbase64, hex, unhex, binary, reverse"
      );
    }

    let result;
    try {
      if (sub === "base64")   result = Buffer.from(text).toString("base64");
      else if (sub === "unbase64" || sub === "decode64") result = Buffer.from(text, "base64").toString("utf8");
      else if (sub === "hex") result = Buffer.from(text).toString("hex");
      else if (sub === "unhex") result = Buffer.from(text, "hex").toString("utf8");
      else if (sub === "binary") {
        result = text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
      }
      else if (sub === "unbinary") {
        result = text.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
      }
      else if (sub === "reverse") {
        result = text.split("").reverse().join("");
      }
      else {
        return message.reply("❌ Unknown method. Use: base64, unbase64, hex, unhex, binary, reverse");
      }
    } catch (e) {
      return message.reply(`❌ Encoding error: ${e.message}`);
    }

    return message.reply(
      `🔐 𝗘𝗡𝗖𝗢𝗗𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📝 Method : ${sub}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${result.slice(0, 1500)}`
    );
  },
};
