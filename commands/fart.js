const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');

const { playSound } = require('../utility/playsound.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fart')
		.setDescription('Replies with a fart!'),
	async execute(interaction) {
        const [success, fart] = await playSound(interaction, "fart");
        let reply;
        if (success) {
            reply = {content: "https://tenor.com/view/fart-gas-cutting-the-cheese-blast-fart-blast-gif-18044330474715481859"}
        } else {
            reply = {content: fart, ephemeral: true}
        }
		await interaction.reply(reply);
	},
};