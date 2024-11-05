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

    /**
     * Run on executing command
     * @param {Discord.ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
        try {
            const fetch = require('isomorphic-unfetch')
            const { getPreview } = require('spotify-url-info')(fetch)
            const { parse } = require('spotify-uri')
            const option = interaction.options.getString('option')
            const result = option ? await tryNull(parse, option) : await tryNull(parse, "https://open.spotify.com/playlist/4k22Y5N4kgzaIHz8sT1X8b?si=839b950daf334c78")
            console.log(result)
            //const result = option ? await getPreview(option) : await getPreview("https://open.spotify.com/playlist/4k22Y5N4kgzaIHz8sT1X8b?si=839b950daf334c78")
            interaction.reply(JSON.stringify(result).split(',').join(',\n'))
        } catch (err) {
            interaction.reply(err.toString())
        }
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

/**
 * Runs the async function and on error returns null
 * @param {function(T): O} f - Function to run
 * @param {T} i - Input it recieves
 * @returns {O | null} - Null or Output
 */
async function tryNull(f, i) {
    try {
        const o = await f(i)
        return o
    } catch (e) {
        return null
    }
}