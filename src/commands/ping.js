import { SlashCommand } from "djs-bot-base";

export default new SlashCommand({
  slashCommandData: (builder) => builder
    .setName("ping")
    .setDescription("Bot'un gecikmesine bakabilirsiniz."),
  async run(interaction) {
    await interaction.reply("Pong!");
  }
});