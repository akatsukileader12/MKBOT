/**
 * MKBOT Command: help
 * @author Charles MK
 */

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmds"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Show all available commands",
    longDescription: "Displays a categorized list of all bot commands, or detailed info about a specific command.",
    category: "system",
    guide: "{pn} — view all commands\n{pn} [command name] — view command details",
  },

  onStart: async function ({ message, args, prefix }) {
    const allCommands = global.GoatBot.commands;
    const categories  = {};

    const emojiMap = {
      system: "⚙️", fun: "🎮", owner: "👑", config: "🔧",
      economy: "💰", media: "📹", tools: "🛠️", utility: "⚡",
      info: "ℹ️", game: "🎯", admin: "🛡️", others: "📦",
    };

    for (const [, cmd] of allCommands) {
      const cat = (cmd.config.category || "others").toLowerCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    }

    if (args[0]) {
      const query = args[0].toLowerCase();
      const cmd   = allCommands.get(query) ||
        [...allCommands.values()].find(c => (c.config.aliases || []).includes(query));

      if (!cmd) {
        return message.reply(
          `❌ Command "${query}" not found.\n` +
          `Use ${prefix}help to see all commands.`
        );
      }

      const c = cmd.config;
      const desc = typeof c.longDescription === "string"
        ? c.longDescription
        : (c.longDescription?.en || c.shortDescription || "No description");
      const usage = typeof c.guide === "string"
        ? c.guide.replace(/{pn}/g, `${prefix}${c.name}`)
        : "No usage info";

      return message.reply(
        `📖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔹 Name     : ${c.name}\n` +
        `🔹 Aliases  : ${(c.aliases || []).join(", ") || "none"}\n` +
        `🔹 Version  : v${c.version || "1.0"}\n` +
        `🔹 Author   : ${c.author || "Charles MK"}\n` +
        `🔹 Category : ${c.category || "others"}\n` +
        `🔹 Role     : ${["User", "Premium", "Admin", "Dev"][c.role || 0] || "Dev"}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 ${desc}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💡 Usage:\n${usage}`
      );
    }

    const totalCmds = allCommands.size;
    let output = `🤖 𝗠𝗞𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n`;
    output    += `━━━━━━━━━━━━━━━━━━\n`;
    output    += `📌 Prefix: "${prefix}"  |  Total: ${totalCmds}\n`;
    output    += `━━━━━━━━━━━━━━━━━━\n\n`;

    for (const [cat, cmds] of Object.entries(categories).sort()) {
      const icon = emojiMap[cat] || "📦";
      output += `${icon} ${cat.toUpperCase()}\n`;
      output += `  ${cmds.sort().join(", ")}\n\n`;
    }

    output += `━━━━━━━━━━━━━━━━━━\n`;
    output += `💡 Type ${prefix}help [command] for details\n`;
    output += `🛠️ Made by Charles MK`;

    return message.reply(output);
  },
};
