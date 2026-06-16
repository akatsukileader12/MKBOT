/**
 * MKBOT – Script (command/event) loader
 * @author Charles MK
 * Scans scripts/cmds and scripts/events, validates each module, and registers them.
 */

const fs   = require("fs-extra");
const path = require("path");
const log  = require("../../logger/log");

const cmdsDir   = path.join(process.cwd(), "scripts", "cmds");
const eventsDir = path.join(process.cwd(), "scripts", "events");

const REQUIRED_CMD_FIELDS = ["name", "category"];

function validateCmd(cmdConfig, filePath) {
  for (const field of REQUIRED_CMD_FIELDS) {
    if (!cmdConfig[field]) {
      throw new Error(`Missing required field "config.${field}" in ${filePath}`);
    }
  }
}

function loadCommands() {
  const { commands, aliases, commandFilesPath } = global.GoatBot;
  const banned = (global.GoatBot.configCommands?.commandBanned || []).map(s => s.toLowerCase());

  if (!fs.existsSync(cmdsDir)) {
    log.warn("LOADER", "scripts/cmds directory not found — skipping commands");
    return;
  }

  const files = fs.readdirSync(cmdsDir).filter(f => f.endsWith(".js"));
  let loaded = 0, failed = 0;

  for (const file of files) {
    const filePath = path.join(cmdsDir, file);
    try {
      delete require.cache[require.resolve(filePath)];
      const mod = require(filePath);

      if (!mod.config) throw new Error("Missing module.exports.config");
      validateCmd(mod.config, file);

      const name = mod.config.name.toLowerCase();

      if (banned.includes(name)) {
        log.warn("LOADER", `Command "${name}" is banned — skipping`);
        continue;
      }

      commands.set(name, mod);
      commandFilesPath.push({ filePath, commandName: [name] });

      if (mod.config.aliases) {
        for (const alias of mod.config.aliases) {
          aliases.set(alias.toLowerCase(), name);
        }
      }

      loaded++;
    } catch (err) {
      log.error("LOADER", `Failed to load command "${file}": ${err.message}`);
      failed++;
    }
  }

  log.success("LOADER", `Commands: ${loaded} loaded, ${failed} failed`);
}

function loadEvents() {
  const { eventCommands, eventCommandsFilesPath } = global.GoatBot;

  if (!fs.existsSync(eventsDir)) {
    log.warn("LOADER", "scripts/events directory not found — skipping events");
    return;
  }

  const files = fs.readdirSync(eventsDir).filter(f => f.endsWith(".js"));
  let loaded = 0, failed = 0;

  for (const file of files) {
    const filePath = path.join(eventsDir, file);
    try {
      delete require.cache[require.resolve(filePath)];
      const mod = require(filePath);

      if (!mod.config?.name) throw new Error("Missing module.exports.config.name");

      const name = mod.config.name.toLowerCase();
      eventCommands.set(name, mod);
      eventCommandsFilesPath.push({ filePath, commandName: [name] });
      loaded++;
    } catch (err) {
      log.error("LOADER", `Failed to load event "${file}": ${err.message}`);
      failed++;
    }
  }

  log.success("LOADER", `Events: ${loaded} loaded, ${failed} failed`);
}

module.exports = { loadCommands, loadEvents };
