const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload')
                .setRequired(true)
        ),
	async execute(interaction) {
        if (interaction.member.id !== ownerId) return;
        const commandName = interaction.options.getString('command')
        delete require.cache[require.resolve(`./${commandName}.js`)];
        const command = require(`./${commandName}.js`)
        interaction.client.commands.set(commandName, command)
        interaction.reply({content: `The command ${commandName} has been reloaded`, ephemeral: true });
        console.log(`The command ${commandName} has been reloaded`);
	},
    isAdmin: true
};