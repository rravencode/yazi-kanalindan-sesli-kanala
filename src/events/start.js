// @ts-check
import { joinVoiceChannel } from "@discordjs/voice";
import { Event } from "djs-bot-base";
import * as fs from "fs";
import { console } from "sneaks";
import config from "../config.js";

export default new Event({
  categoryName: "ready",
  run(bot) {
    const guild = bot.guilds.cache.get(config.guildId);
    if (typeof guild === "undefined") {
      console.error("Bu sunucuya erişemiyorum!");
      return;
    }

    fs.rmSync("./res", { recursive: true, force: true });

    const resFolder = fs.existsSync("./res");
    if (resFolder === false) {
      fs.mkdirSync("./res");
      console.info("'res' klasörü oluşturuldu.");
    }

    joinVoiceChannel({
      channelId: config.voiceChannelId,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    });

    console.info("Bot başarıyla Discord'a giriş yaptı.");
  }
})