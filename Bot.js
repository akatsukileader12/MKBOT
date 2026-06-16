/**
 * MKBOT – Main bot process
 * @author Charles MK
 * @version 1.0.0
 *
 * Sets up globals, connects to the database, logs in to Facebook,
 * loads all commands/events, and starts listening.
 */

process.on("unhandledRejection", (err) => {
  log.error("UNHANDLED_REJECTION", err?.message || String(err));
});

process.on("uncaughtException", (err) => {
  log.error("UNCAUGHT_EXCEPTION", err?.message || String(err));
  log.error("UNCAUGHT_EXCEPTION", err?.stack || "No stack trace");
  setTimeout(() => process.exit(1), 1000);
});

const http = require("http");
const fs   = require("fs-extra");
const path = require("path");
const cron = require("node-cron");
const gradient = require("gradient-string");

const log             = require("./logger/log");
const { doLogin }     = require("./bot/login/login");
const { loadDatabase } = require("./bot/login/loadData");
const { loadCommands, loadEvents } = require("./bot/utils/loadScripts");
const startListening  = require("./bot/handleListening");
const utils           = require("./utils");

/* ─── Keepalive HTTP server — starts immediately so Render's port scan passes ── */
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`MKBOT is running. Uptime: ${utils.formatUptime(Date.now() - (global.GoatBot?.startTime || Date.now()))}`);
}).listen(PORT, "0.0.0.0", () => {
  log.info("SERVER", `Keepalive server listening on port ${PORT}`);
});

/* ─── Validate config.json ──────────────────────────────────- */
const configPath = path.join(__dirname, "config.json");
const configCommandsPath = path.join(__dirname, "configCommands.json");

if (!fs.existsSync(configPath)) {
  console.error("[MKBOT] config.json not found. Please create it.");
  process.exit(1);
}

const config         = require(configPath);
const configCommands = fs.existsSync(configCommandsPath)
  ? require(configCommandsPath)
  : { commandBanned: [], envGlobal: {}, envCommands: {}, envEvents: {} };

/* ─── Globals ───────────────────────────────────────────────- */
global.GoatBot = {
  startTime:        Date.now() - process.uptime() * 1000,
  commands:         new Map(),
  eventCommands:    new Map(),
  aliases:          new Map(),
  commandFilesPath: [],
  eventCommandsFilesPath: [],
  onChat:           [],
  onEvent:          [],
  onReply:          new Map(),
  onReaction:       new Map(),
  config,
  configCommands,
  fcaApi:           null,
  botID:            null,
  reLoginBot:       () => {},
  Listening:        null,
};

global.db = {
  allThreadData:  [],
  allUserData:    [],
  threadModel:    null,
  userModel:      null,
  globalModel:    null,
  threadsData:    null,
  usersData:      null,
  globalData:     null,
};

global.utils  = utils;
global.client = {
  countDown:      {},
  cache:          {},
  commandBanned:  configCommands.commandBanned || [],
};

/* ─── Banner ────────────────────────────────────────────────- */
function printBanner() {
  const banner = gradient(["#9b59b6", "#3498db"])(
    `
  ███╗   ███╗ ██████╗ ██████╗  ██████╗ ████████╗
  ████╗ ████║██╔═══██╗██╔══██╗██╔═══██╗╚══██╔══╝
  ██╔████╔██║██║   ██║██████╔╝██║   ██║   ██║   
  ██║╚██╔╝██║██║   ██║██╔══██╗██║   ██║   ██║   
  ██║ ╚═╝ ██║╚██████╔╝██████╔╝╚██████╔╝   ██║   
  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝   
`
  );
  console.log(banner);
  console.log(gradient(["#9b59b6", "#3498db"])("  MKBOT v1.0.0 — by Charles MK\n"));
}

/* ─── Auto-restart cron ─────────────────────────────────────- */
function setupAutoRestart() {
  const autoRestart = config.autoRestart;
  if (!autoRestart?.time) return;

  if (cron.validate(autoRestart.time)) {
    cron.schedule(autoRestart.time, () => {
      log.info("AUTO_RESTART", "Scheduled restart triggered");
      process.exit(2);
    });
    log.info("AUTO_RESTART", `Scheduled at: ${autoRestart.time}`);
  } else {
    log.warn("AUTO_RESTART", "Invalid cron expression in config.autoRestart.time");
  }
}

/* ─── Boot sequence ─────────────────────────────────────────- */
(async function boot() {
  printBanner();
  log.info("MKBOT", `Starting MKBOT — ${utils.getTime()}`);

  await loadDatabase(config);
  loadCommands();
  loadEvents();
  setupAutoRestart();

  const api = await doLogin(config);

  global.GoatBot.botID   = api.getCurrentUserID();
  global.GoatBot.fcaApi  = api;

  /* Allow commands to trigger a re-login */
  global.GoatBot.reLoginBot = async () => {
    log.info("RELOGIN", "Re-logging in...");
    const newApi = await doLogin(config);
    global.GoatBot.fcaApi = newApi;
    await startListening(newApi);
  };

  await startListening(api);

  // Notify admin on startup — confirms fresh cookies are working
  const adminID = config.adminBot?.[0];
  if (adminID) {
    try {
      await api.sendMessage(
        `✅ MKBOT is online!\n` +
        `🤖 ID: ${global.GoatBot.botID}\n` +
        `⚡ Prefix: "${config.prefix}"\n` +
        `📦 Commands: ${global.GoatBot.commands.size} | Events: ${global.GoatBot.eventCommands.size}`,
        adminID
      );
    } catch (e) {
      log.warn('MKBOT', `Could not send startup DM: ${e.message}`);
    }
  }

  log.success("MKBOT", `Bot is live! ID: ${global.GoatBot.botID}  Prefix: "${config.prefix}"`);
  log.success("MKBOT", `Commands loaded: ${global.GoatBot.commands.size}  Events: ${global.GoatBot.eventCommands.size}`);
})();
