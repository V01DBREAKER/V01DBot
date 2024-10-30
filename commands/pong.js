const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pong')
		.setDescription('Replies with Ping!'),
	async execute(interaction) {
		interaction.reply('Ping!');
	},
};