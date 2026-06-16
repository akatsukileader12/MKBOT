/**
 * MKBOT Command: shell
 * @author Charles MK
 * Execute shell commands. Dev only.
 */

const { exec } = require("child_process");

module.exports = {
  config: {
    name: "shell",
    aliases: ["sh", "bash", "terminal"],
    version: "1.0",
    author: "Charles MK",
    role: 3,
    shortDescription: "Run a shell command (dev only)",
    category: "system",
    guide: "{pn} [command]",
  },

  onStart: async function ({ message, args }) {
    const cmd = args.join(" ");
    if (!cmd) return message.reply("❌ Provide a shell command to run.");

    const start = Date.now();
    return new Promise((resolve) => {
      exec(cmd, { timeout: 20000, maxBuffer: 1024 * 512 }, (err, stdout, stderr) => {
        const elapsed = Date.now() - start;
        const out = (stdout || "") + (stderr || "");
        const text = out.trim().slice(0, 1800) || "(no output)";

        resolve(message.reply(
          `💻 𝗦𝗛𝗘𝗟𝗟 𝗢𝗨𝗧𝗣𝗨𝗧\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `$ ${cmd}\n\n` +
          `${text}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `⏱️ ${elapsed}ms | Exit: ${err ? err.code || 1 : 0}`
        ));
      });
    });
  },
};
