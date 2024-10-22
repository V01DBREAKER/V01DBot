const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music and disconnects the bot.'),
	async execute(interaction) {
        let jukebox = interaction.client.music.get(interaction.guildId);
        if (!jukebox){
            interaction.reply("Nothing currently playing.")
        } else {
            jukebox.stop()
            interaction.reply("Disconnected from voice channel.")
        }
	},
};