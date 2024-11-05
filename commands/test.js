const Discord = require('discord.js');
const { formatTime } = require('../utility/utility')


module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('test')
		.setDescription('testingstuff')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('generic option')
        ),

    /**
     * Run on executing command
     * @param {Discord.ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
        try {
            const option = interaction.options.getString('option')
            const searchTerm = option ? option : "Kyougen Ado"
            const yts = require('yt-search');
            const list = await yts(searchTerm);
            interaction.reply(`${list.playlists[0].thumbnail}`);
        } catch (err) {
            interaction.reply(err.toString())
        }
        /* spotify
            const fetch = require('isomorphic-unfetch')
            const { getDetails } = require('spotify-url-info')(fetch)
            const { parse } = require('spotify-uri')
            const option = interaction.options.getString('option')
            const result = option ? await tryNull(getDetails, option) : await tryNull(getDetails, "https://open.spotify.com/playlist/4k22Y5N4kgzaIHz8sT1X8b?si=839b950daf334c78")
            console.log(result)
            //const result = option ? await getPreview(option) : await getPreview("https://open.spotify.com/playlist/4k22Y5N4kgzaIHz8sT1X8b?si=839b950daf334c78")
            interaction.reply(`${result.tracks.length}`)
        */
        /* yt-search
        const yts = require('yt-search');
        const list = await yts( { listId: 'PL_uNUzCOeOeVzkNPYE59e4BzKTsZIiRVq' } );
        interaction.reply(list.title + " " + list.size)
        */
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