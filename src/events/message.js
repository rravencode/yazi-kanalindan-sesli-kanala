// @ts-check
import { NoSubscriberBehavior, createAudioPlayer, createAudioResource, getVoiceConnection } from "@discordjs/voice";
import axios from "axios";
import { TextChannel, cleanCodeBlockContent } from "discord.js";
import { Event } from "djs-bot-base";
import * as fs from "fs";
import tts from "google-tts-api";
import { console } from "sneaks";
import { v1 } from "uuid";
import config from "../config.js";

export default new Event({
  categoryName: "messageCreate",
  async run(message) {
    if (!message.guild || message.author.bot || !(message.channel instanceof TextChannel)) return;
    if (message.channelId !== config.channelId) return;

    const messageContent = cleanCodeBlockContent(message.content);
    if (messageContent === "" || !messageContent.length) return;

    const audioUrl = tts.getAudioUrl(`${message.author.displayName} diyor ki: ${messageContent}`, { lang: "tr" });
    const resPath = `./res/${v1()}.mp3`;

    const response = await axios.get(audioUrl, { responseType: "arraybuffer" })
      .catch(() => undefined);
    if (typeof response === "undefined") {
      console.error(`Yazı sese dönüştürülemedi: ${messageContent}`);
      return;
    }
    
    fs.writeFileSync(resPath, response.data, "binary");

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    const resource = createAudioResource(resPath);
    const connection = getVoiceConnection(message.guild.id);
    if (typeof connection === "undefined") {
      console.error("Bot sesli kanala henüz giriş yapmamış.");
      return;
    }

    player.play(resource);
    connection.subscribe(player);
  }
});