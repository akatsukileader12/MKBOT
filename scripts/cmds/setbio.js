/**
 * MKBOT Command: setbio
 * @author Charles MK
 * Set a custom bio shown on your MKBOT profile.
 */

module.exports = {
  config: {
    name: "setbio",
    aliases: ["bio", "mybio"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Set your profile bio",
    category: "economy",
    guide: "{pn} [text] — set your bio\n{pn} clear — remove your bio",
  },
  onStart: async function ({ message, args, event, usersData }) {
    const sub  = (args[0] || "").toLowerCase();
    if (sub === "clear" || sub === "remove" || sub === "reset") {
      await usersData.set(event.senderID, { bio: "" });
      return message.reply("✅ Bio cleared!");
    }
    const bio = args.join(" ").trim().slice(0, 150);
    if (!bio) return message.reply("❌ Usage: /setbio [your bio]\nMax 150 characters.");
    await usersData.set(event.senderID, { bio });
    return message.reply(`✅ Bio set: "${bio}"`);
  },
};
