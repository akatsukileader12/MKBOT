/**
 * MKBOT Command: github
 * @author Charles MK
 * Look up a GitHub user or repository.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "github",
    aliases: ["gh", "gituser"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Look up a GitHub user or repo",
    category: "utility",
    guide: "{pn} [username]         — user profile\n{pn} [username/repo]    — repo info",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Usage: /github [username] or /github [user/repo]");
    }

    const input = args[0];

    try {
      if (input.includes("/")) {
        // Repo lookup
        const { data } = await axios.get(
          `https://api.github.com/repos/${input}`,
          { timeout: 8000, headers: { "Accept": "application/vnd.github.v3+json" } }
        );

        return message.reply(
          `📦 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📛 Name     : ${data.full_name}\n` +
          `📝 Desc     : ${data.description || "No description"}\n` +
          `⭐ Stars    : ${data.stargazers_count.toLocaleString()}\n` +
          `🍴 Forks    : ${data.forks_count.toLocaleString()}\n` +
          `👁️ Watchers : ${data.watchers_count.toLocaleString()}\n` +
          `🐛 Issues   : ${data.open_issues_count}\n` +
          `💻 Language : ${data.language || "N/A"}\n` +
          `📅 Created  : ${new Date(data.created_at).toDateString()}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🔗 ${data.html_url}\n` +
          `🤖 MKBOT by Charles MK`
        );
      } else {
        // User lookup
        const { data } = await axios.get(
          `https://api.github.com/users/${input}`,
          { timeout: 8000, headers: { "Accept": "application/vnd.github.v3+json" } }
        );

        return message.reply(
          `👤 𝗚𝗜𝗧𝗛𝗨𝗕 𝗨𝗦𝗘𝗥\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📛 Name     : ${data.name || data.login}\n` +
          `🔗 Username : @${data.login}\n` +
          `📝 Bio      : ${data.bio || "No bio"}\n` +
          `📁 Repos    : ${data.public_repos}\n` +
          `👥 Followers: ${data.followers.toLocaleString()}\n` +
          `➡️ Following : ${data.following}\n` +
          `📍 Location : ${data.location || "N/A"}\n` +
          `🏢 Company  : ${data.company || "N/A"}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🔗 ${data.html_url}\n` +
          `🤖 MKBOT by Charles MK`
        );
      }
    } catch (err) {
      if (err.response?.status === 404) {
        return message.reply(`❌ GitHub user/repo "${input}" not found.`);
      }
      return message.reply("❌ GitHub lookup failed. Try again later.");
    }
  },
};
