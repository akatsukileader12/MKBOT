/**
 * MKBOT Command: cmd
 * @author Charles MK
 * Install, remove, or replace commands from a URL/Gist on the fly.
 * Usage:
 *   /cmd install [url]   — download and load a new command from URL
 *   /cmd remove [name]   — delete a command file by name
 *   /cmd replace [name] [url] — replace existing command file from URL
 *   /cmd list            — list loaded commands
 *   /cmd reload          — reload all commands without restarting
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const { loadCommands } = require("../../bot/utils/loadScripts");

const CMDS_DIR = path.join(process.cwd(), "scripts", "cmds");

async function downloadFile(url) {
  const res = await axios.get(url, { timeout: 15000, responseType: "text" });
  return String(res.data);
}

function inferFileName(url, code) {
  // Try to get name from the module config.name in the code
  const match = code.match(/["']name["']\s*:\s*["']([^"']+)["']/);
  if (match) return `${match[1].toLowerCase()}.js`;

  // Fall back to URL filename
  const urlPart = url.split("?")[0].split("/").pop();
  return urlPart.endsWith(".js") ? urlPart : `${urlPart}.js`;
}

module.exports = {
  config: {
    name: "cmd",
    aliases: ["command"],
    version: "1.0",
    author: "Charles MK",
    role: 3,
    shortDescription: "Install, remove, replace, or reload commands",
    longDescription: "Download and hot-load commands from a URL/Gist without restarting the bot. Dev-only.",
    category: "system",
    guide: [
      "{pn} install [url]          — install new command",
      "{pn} remove [name]          — remove a command",
      "{pn} replace [name] [url]   — replace existing command",
      "{pn} list                   — list all loaded commands",
      "{pn} reload                 — reload all commands",
    ].join("\n"),
  },

  onStart: async function ({ message, args }) {
    const sub = (args[0] || "").toLowerCase();

    /* ── list ─────────────────────────────────────────────── */
    if (sub === "list") {
      const names = [...global.GoatBot.commands.keys()].sort();
      return message.reply(
        `📦 𝗟𝗢𝗔𝗗𝗘𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 (${names.length})\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        names.join(", ")
      );
    }

    /* ── reload ───────────────────────────────────────────── */
    if (sub === "reload") {
      const before = global.GoatBot.commands.size;
      global.GoatBot.commands.clear();
      global.GoatBot.aliases.clear();
      global.GoatBot.commandFilesPath = [];
      loadCommands();
      const after = global.GoatBot.commands.size;
      return message.reply(
        `♻️ Commands reloaded!\n` +
        `Before: ${before}  →  After: ${after}`
      );
    }

    /* ── install ──────────────────────────────────────────── */
    if (sub === "install") {
      const url = args[1];
      if (!url) return message.reply("❌ Usage: /cmd install [url]");

      const wait = await message.reply("⏳ Downloading command...");

      let code;
      try { code = await downloadFile(url); }
      catch (e) { return message.reply(`❌ Download failed: ${e.message}`); }

      // Basic validation — must export config.name
      if (!code.includes("module.exports") || !code.includes("config")) {
        return message.reply("❌ Invalid command file — missing module.exports or config.");
      }

      const fileName = inferFileName(url, code);
      const filePath = path.join(CMDS_DIR, fileName);

      if (fs.existsSync(filePath)) {
        return message.reply(
          `⚠️ "${fileName}" already exists.\n` +
          `Use: /cmd replace ${fileName.replace(".js", "")} [url]`
        );
      }

      fs.writeFileSync(filePath, code, "utf8");

      // Hot-load the new command
      try {
        const mod = require(filePath);
        if (!mod.config?.name) throw new Error("config.name missing");
        const name = mod.config.name.toLowerCase();
        global.GoatBot.commands.set(name, mod);
        if (mod.config.aliases) {
          for (const alias of mod.config.aliases) {
            global.GoatBot.aliases.set(alias.toLowerCase(), name);
          }
        }
        if (typeof mod.onChat === "function") global.GoatBot.onChat.push(name);
        return message.reply(
          `✅ Command "${name}" installed!\n` +
          `📁 File: ${fileName}\n` +
          `💡 Use /${name} to try it.`
        );
      } catch (e) {
        fs.removeSync(filePath);
        return message.reply(`❌ Command loaded but failed validation: ${e.message}\nFile removed.`);
      }
    }

    /* ── remove ───────────────────────────────────────────── */
    if (sub === "remove") {
      const name = (args[1] || "").toLowerCase().replace(".js", "");
      if (!name) return message.reply("❌ Usage: /cmd remove [command name]");

      const filePath = path.join(CMDS_DIR, `${name}.js`);
      if (!fs.existsSync(filePath)) {
        return message.reply(`❌ No file found for command "${name}".`);
      }

      fs.removeSync(filePath);
      delete require.cache[require.resolve(filePath)];
      global.GoatBot.commands.delete(name);
      global.GoatBot.aliases.forEach((v, k) => { if (v === name) global.GoatBot.aliases.delete(k); });
      global.GoatBot.onChat = global.GoatBot.onChat.filter(n => n !== name);

      return message.reply(`🗑️ Command "${name}" removed successfully.`);
    }

    /* ── replace ──────────────────────────────────────────── */
    if (sub === "replace") {
      const name = (args[1] || "").toLowerCase().replace(".js", "");
      const url  = args[2];
      if (!name || !url) return message.reply("❌ Usage: /cmd replace [name] [url]");

      const filePath = path.join(CMDS_DIR, `${name}.js`);

      await message.reply("⏳ Downloading replacement...");

      let code;
      try { code = await downloadFile(url); }
      catch (e) { return message.reply(`❌ Download failed: ${e.message}`); }

      if (!code.includes("module.exports") || !code.includes("config")) {
        return message.reply("❌ Invalid command file — missing module.exports or config.");
      }

      const backupPath = filePath + ".bak";
      if (fs.existsSync(filePath)) fs.copySync(filePath, backupPath);

      fs.writeFileSync(filePath, code, "utf8");

      try {
        delete require.cache[require.resolve(filePath)];
        const mod = require(filePath);
        if (!mod.config?.name) throw new Error("config.name missing");
        const newName = mod.config.name.toLowerCase();

        // Remove old entry then re-add
        global.GoatBot.commands.delete(name);
        global.GoatBot.commands.set(newName, mod);
        if (mod.config.aliases) {
          for (const alias of mod.config.aliases) {
            global.GoatBot.aliases.set(alias.toLowerCase(), newName);
          }
        }
        if (typeof mod.onChat === "function" && !global.GoatBot.onChat.includes(newName)) {
          global.GoatBot.onChat.push(newName);
        }
        if (fs.existsSync(backupPath)) fs.removeSync(backupPath);

        return message.reply(
          `✅ Command "${newName}" replaced!\n` +
          `📁 File: ${name}.js\n` +
          `💡 Use /${newName} to try it.`
        );
      } catch (e) {
        // Restore backup
        if (fs.existsSync(backupPath)) {
          fs.copySync(backupPath, filePath);
          fs.removeSync(backupPath);
        }
        return message.reply(`❌ Replacement failed validation: ${e.message}\nOriginal file restored.`);
      }
    }

    /* ── fallback ─────────────────────────────────────────── */
    return message.reply(
      `📦 𝗖𝗠𝗗 𝗠𝗔𝗡𝗔𝗚𝗘𝗥\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `/cmd install [url]           — install new command\n` +
      `/cmd remove [name]           — remove a command\n` +
      `/cmd replace [name] [url]    — replace existing command\n` +
      `/cmd list                    — list all commands\n` +
      `/cmd reload                  — reload all commands`
    );
  },
};
