const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');

const { playSound } = require('../utility/playsound.js')
const soundEffects = require('../utility/soundeffects.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('soundeffect')
		.setDescription('Replies with a sound effect!')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Pick a sound effect.')
                .setRequired(true)
                .addChoices(soundEffects.getChoices())
                //.addChoices(...soundEffects.getChoices().map(choice => ({name: choice.name, value: choice.value})))
        ),
	async execute(interaction) {
        const name = interaction.options.getString('option')
        const effect = soundEffects.effects.find((el)=> el.value == name)
        const [success, fail] = await playSound(interaction, effect.path);
        let reply;
        if (success) {
            reply = {content: effect.reply, ephemeral: effect.empheral}
        } else {
            reply = {content: fail, ephemeral: true}
        }
		await interaction.reply(reply);
	},
};