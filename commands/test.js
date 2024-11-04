const { SlashCommandBuilder } = require('discord.js');
const { formatTime } = require('../utility/format')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('testingstuff')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('generic option')
        ),

	async execute(interaction) {
        setTimeout(()=>{
            interaction.reply(interaction.options.getString('option'))
        }, 2000)
	},
    isAdmin: true
};