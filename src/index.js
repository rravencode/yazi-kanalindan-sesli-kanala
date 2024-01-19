// @ts-check
import { Client, Partials } from "discord.js";
import { CommandHandler, EventHandler } from "djs-bot-base";
import { AntiCrash } from "utilscord";
import config from "./config.js";

const commands = new CommandHandler({ suppressWarnings: true, slashCommandsDir: "./src/commands" });
const events = new EventHandler({ suppressWarnings: true, eventsDir: "./src/events" });

const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "MessageContent",
    "GuildVoiceStates"
  ],
  partials: [Partials.User, Partials.Channel, Partials.Message],
});

new AntiCrash({ hidden: false })
  .init();

(async () => {
  await commands.setSlashCommands();
  await events.setEvents(client);
  commands.setDefaultSlashHandler(client);
  
  await client.login(config.token);
  await commands.registerSlashCommands(client);
})();