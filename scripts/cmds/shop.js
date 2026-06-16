/**
 * MKBOT Command: shop
 * @author Charles MK
 * In-bot item shop — buy titles, roles, and perks.
 */

const ITEMS = [
  { id: "vip",      name: "VIP Badge",       price: 5000,  emoji: "👑", desc: "Show off your VIP status" },
  { id: "premium",  name: "Premium Role",     price: 10000, emoji: "💎", desc: "Access premium commands" },
  { id: "lucky",    name: "Lucky Charm",      price: 2000,  emoji: "🍀", desc: "+10% economy rewards for 24h" },
  { id: "shield",   name: "Robbery Shield",   price: 3000,  emoji: "🛡️", desc: "Immune to robbery for 24h" },
  { id: "xp2x",     name: "XP Booster 2x",   price: 1500,  emoji: "⚡", desc: "Double XP for 12h" },
  { id: "custom",   name: "Custom Title",     price: 8000,  emoji: "✏️", desc: "Set a custom title badge" },
];

module.exports = {
  config: {
    name: "shop",
    aliases: ["store", "market"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Browse and buy items from the shop",
    category: "economy",
    guide: "{pn} — view shop\n{pn} buy [item id] — purchase an item\n{pn} inventory — your items",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const sub = (args[0] || "").toLowerCase();

    if (sub === "inventory" || sub === "inv") {
      const user  = await usersData.get(event.senderID);
      const items = user?.inventory || [];
      if (!items.length) {
        return message.reply("🎒 Your inventory is empty!\nUse /shop to buy items.");
      }
      const lines = items.map(id => {
        const item = ITEMS.find(i => i.id === id);
        return item ? `${item.emoji} ${item.name}` : `🔹 ${id}`;
      });
      return message.reply(
        `🎒 𝗬𝗢𝗨𝗥 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        lines.join("\n")
      );
    }

    if (sub === "buy") {
      const itemID = (args[1] || "").toLowerCase();
      const item   = ITEMS.find(i => i.id === itemID);
      if (!item) {
        return message.reply(`❌ Item "${itemID}" not found.\nUse /shop to see available items.`);
      }

      const user   = await usersData.get(event.senderID);
      const wallet = user?.money || 0;

      if (wallet < item.price) {
        return message.reply(
          `❌ Not enough money!\n` +
          `💰 Cost : $${item.price.toLocaleString()}\n` +
          `💵 Have : $${wallet.toLocaleString()}\n` +
          `❓ Need : $${(item.price - wallet).toLocaleString()} more`
        );
      }

      const inventory = user?.inventory || [];
      if (inventory.includes(item.id)) {
        return message.reply(`ℹ️ You already own "${item.name}".`);
      }

      inventory.push(item.id);
      await usersData.set(event.senderID, { money: wallet - item.price, inventory });

      return message.reply(
        `✅ 𝗣𝗨𝗥𝗖𝗛𝗔𝗦𝗘𝗗!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${item.emoji} ${item.name}\n` +
        `💰 Paid : $${item.price.toLocaleString()}\n` +
        `💵 Bal  : $${(wallet - item.price).toLocaleString()}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${item.desc}`
      );
    }

    const lines = ITEMS.map(i =>
      `${i.emoji} [${i.id}] ${i.name} — $${i.price.toLocaleString()}\n  ${i.desc}`
    );

    return message.reply(
      `🏪 𝗦𝗛𝗢𝗣\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      lines.join("\n\n") +
      `\n━━━━━━━━━━━━━━━━━━\n` +
      `💡 Buy: /shop buy [id]\n🎒 Inv: /shop inventory`
    );
  },
};
