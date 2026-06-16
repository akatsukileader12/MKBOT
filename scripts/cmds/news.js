/**
 * MKBOT Command: news
 * @author Charles MK
 * Get latest news headlines using GNews API (free tier).
 * Falls back to BBC RSS if no API key.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "news",
    aliases: ["headlines", "topnews"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get latest news headlines",
    category: "utility",
    guide: "{pn} — top headlines\n{pn} [topic] — news about a topic\nSet GNEWS_API_KEY env var for more results",
  },

  onStart: async function ({ message, args }) {
    const topic = args.join(" ");

    // Try GNews API first if key available
    if (process.env.GNEWS_API_KEY) {
      try {
        const params = {
          token: process.env.GNEWS_API_KEY,
          max: 5,
          lang: "en",
        };
        if (topic) params.q = topic;
        else params.topic = "general";

        const { data } = await axios.get("https://gnews.io/api/v4/top-headlines", { params, timeout: 8000 });
        const articles  = data?.articles || [];

        if (!articles.length) return message.reply("ℹ️ No news found.");

        const lines = articles.map((a, i) =>
          `${i + 1}. ${a.title}\n   📰 ${a.source?.name || "Unknown"}\n   🔗 ${a.url}`
        );

        return message.reply(
          `📰 𝗧𝗢𝗣 𝗡𝗘𝗪𝗦${topic ? ` — ${topic}` : ""}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          lines.join("\n\n") +
          `\n━━━━━━━━━━━━━━━━━━\n🤖 MKBOT by Charles MK`
        );
      } catch {}
    }

    // Fallback: BBC RSS
    try {
      const feedUrl = topic
        ? `https://feeds.bbci.co.uk/news/${encodeURIComponent(topic)}/rss.xml`
        : "https://feeds.bbci.co.uk/news/rss.xml";

      const { data } = await axios.get(feedUrl, { timeout: 8000 });

      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      while ((match = itemRegex.exec(data)) !== null && items.length < 5) {
        const titleMatch = match[1].match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) ||
                           match[1].match(/<title>([^<]+)<\/title>/);
        const linkMatch  = match[1].match(/<link>([^<]+)<\/link>/);
        if (titleMatch && linkMatch) {
          items.push({ title: titleMatch[1], link: linkMatch[1] });
        }
      }

      if (!items.length) return message.reply("❌ Could not fetch news right now.");

      const lines = items.map((n, i) => `${i + 1}. ${n.title}\n   🔗 ${n.link}`);
      return message.reply(
        `📰 𝗕𝗕𝗖 𝗡𝗘𝗪𝗦\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        lines.join("\n\n") +
        `\n━━━━━━━━━━━━━━━━━━\n🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ News service unavailable. Try again later.");
    }
  },
};
