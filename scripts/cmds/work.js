/**
 * MKBOT Command: work
 * @author Charles MK
 * Work to earn money (cooldown: 1 hour).
 */

const COOLDOWN = 60 * 60 * 1000; // 1 hour

const JOBS = [
  { name: "Software Developer",  emoji: "💻", min: 200, max: 500 },
  { name: "Food Delivery Driver",emoji: "🛵", min: 100, max: 250 },
  { name: "Graphic Designer",    emoji: "🎨", min: 150, max: 350 },
  { name: "YouTuber",            emoji: "📹", min: 50,  max: 600 },
  { name: "Stock Trader",        emoji: "📈", min: 0,   max: 800 },
  { name: "Nurse",               emoji: "🏥", min: 200, max: 400 },
  { name: "Mechanic",            emoji: "🔧", min: 150, max: 300 },
  { name: "Streamer",            emoji: "🎮", min: 30,  max: 700 },
  { name: "Data Scientist",      emoji: "📊", min: 250, max: 600 },
  { name: "Freelancer",          emoji: "💼", min: 80,  max: 450 },
];

module.exports = {
  config: {
    name: "work",
    aliases: ["job", "earn"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Work and earn money (1 hour cooldown)",
    category: "economy",
    guide: "{pn} — work and earn money",
  },

  onStart: async function ({ message, event, usersData }) {
    const user     = await usersData.get(event.senderID);
    const lastWork = user?.lastWork || 0;

    if (Date.now() - lastWork < COOLDOWN) {
      const remaining = Math.ceil((COOLDOWN - (Date.now() - lastWork)) / 60000);
      return message.reply(
        `⏳ You're tired from working!\n` +
        `Come back in ${remaining} minute(s).`
      );
    }

    const job     = JOBS[Math.floor(Math.random() * JOBS.length)];
    const earned  = Math.floor(job.min + Math.random() * (job.max - job.min));
    const wallet  = user?.money || 0;
    const newBal  = wallet + earned;

    await usersData.set(event.senderID, { money: newBal, lastWork: Date.now() });

    return message.reply(
      `${job.emoji} 𝗪𝗢𝗥𝗞 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💼 Job     : ${job.name}\n` +
      `💰 Earned  : $${earned.toLocaleString()}\n` +
      `💵 Balance : $${newBal.toLocaleString()}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⏰ Next work: in 1 hour`
    );
  },
};
