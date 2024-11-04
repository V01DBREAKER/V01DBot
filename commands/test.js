const Discord = require('discord.js');
const { formatTime } = require('../utility/format')

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('test')
		.setDescription('testingstuff')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('generic option')
        ),

	async execute(interaction) {
        const yts = require('yt-search');
        const list = await yts( { listId: 'PL_uNUzCOeOeVzkNPYE59e4BzKTsZIiRVq' } );

        interaction.reply(list.title + " " + list.size)
        /* selector 
        const selector = new Discord.StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Choose a disc!')
            .addOptions([1,2,3,4,5].map((el) => 
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(`${el}`)
                    .setDescription(`${el}`)
                    .setValue(`${el}`)
            ));
        const row = new Discord.ActionRowBuilder().addComponents(selector)
        interaction.reply({content: "hi", components: [row]})
        */
        /* echo
        setTimeout(()=>{
            interaction.reply(interaction.options.getString('option'))
        }, 2000)*/
	},
    isAdmin: true
};