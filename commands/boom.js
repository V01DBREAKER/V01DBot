const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');

const { playSound } = require('../utility/playsound.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('boom')
		.setDescription('Plays the vine boom sound effect.'),
	async execute(interaction) {
        let [success, reply] = await playSound(interaction, "vine-boom");
        if (success) {
            reply = "Boomed in chat."
        }
        await interaction.reply({content: reply, ephemeral: true});
	},
};