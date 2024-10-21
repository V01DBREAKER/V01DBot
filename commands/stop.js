const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('[WIP] stops all playing audio.'),
	async execute(interaction) {
        const connection = await dv.getVoiceConnection(interaction.member.voice.channel.guild.id);
        if (connection) {
            connection.destroy();  // Disconnect the bot
        }
        await interaction.reply("Disconnected from voice channel.")
	},
};