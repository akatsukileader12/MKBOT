/**
 * MKBOT Event: autoUpdateInfoThread
 * Keeps the thread name synced in the database.
 * @author Charles MK
 */

module.exports = {
  config: {
    name: "autoUpdateInfoThread",
    version: "1.0",
    author: "Charles MK",
    description: "Automatically keeps thread info up to date in the database",
  },

  onStart: async function ({ event, threadsData }) {
    if (!event.threadID) return;

    try {
      const thread = await threadsData.get(event.threadID);
      const newName = event.logMessageData?.name || event.threadName;
      if (newName && thread && thread.threadName !== newName) {
        await threadsData.set(event.threadID, { threadName: newName });
      }
    } catch { /* non-critical */ }
  },
};
