const path = require('node:path');
const Discord = require("discord.js");
const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytpl = require('ytpl');
const yts = require('yt-search');
const { Jukebox, Disc } = require('../utility/jukebox');
const { formatTime } = require('../utility/format');

const MAX_RESPONSE_MS = 60_000;

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('jukebox')
		.setDescription('[WIP] Can play music!')
        .addSubcommand(play =>
            play.setName('play')
                .setDescription('Plays a yt video')
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('URL to the yt video')
                        .setRequired(true)))
        .addSubcommand(stop =>
            stop.setName('stop')
                .setDescription('Stops the music and disconnects the bot.'))
        .addSubcommand(playlist => 
            playlist.setName('playlist')
                .setDescription('Displays the song queue.'))
        .addSubcommand(skip => 
            skip.setName('skip')
                .setDescription('Skips the current song.')
                .addIntegerOption(amount => 
                    amount.setName('amount')
                        .setDescription('Number of songs to skip.')
                        .setMinValue(1)))
        .addSubcommand(nowplaying => 
            nowplaying.setName('nowplaying')
                .setDescription('Get information about the current song.'))
        .addSubcommand(pause => 
            pause.setName('pause')
                .setDescription('Pause or unpause the jukebox.')),
                
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand()
        //let reply = await eval(subcommand + "(interaction)");
        switch (subcommand) { // i would use eval for this but idk tbh
            case 'play':
                play(interaction);
                break;
            case 'stop':
                interaction.reply(stop(interaction));
                break;
            case 'playlist':
                playlist(interaction);
                break;
            case 'skip':
                interaction.reply(skip(interaction));
                break;
            case 'nowplaying':
                interaction.reply(nowplaying(interaction));
                break;
            case 'pause':
                interaction.reply(pause(interaction));
                break;
        }
        
	},
};

async function play(interaction){
    const channel = interaction.member.voice.channel;
    if (!channel) return "You must be in a voice channel!";
    if (!channel.speakable) return "Cannot join channel.";

    const url = interaction.options.getString('url')
    if (ytdl.validateURL(url)) {
        let jukebox = interaction.client.music.get(interaction.guildId);
        if (!jukebox){
            jukebox = new Jukebox(interaction.client, channel);
            interaction.client.music.set(interaction.guildId, jukebox);
        }
        
        let [isPlaying, disc] = await jukebox.add(url)
        if (isPlaying){
            return `Added \`${disc.title}\` to playlist.`
        }
        return `Now playing: \`${disc.title}\``;
    } else if (ytpl.validateID(url)) {
        let jukebox = interaction.client.music.get(interaction.guildId);
        if (!jukebox){
            jukebox = new Jukebox(interaction.client, channel);
            interaction.client.music.set(interaction.guildId, jukebox);
        }
        // add first 5 songs to playlist and the rest to the waitlist
        const listInfo = await ytpl(url);
        let [isPlaying, disc] = await jukebox.addPlaylist(listInfo.items.map(el=>el.shortUrl));
        let warning = ""
        if (listInfo.estimatedItemCount > 100) warning = "\n*More than 100 songs in playlist, only 100 will be added.*"
        if (isPlaying){
            interaction.editReply({ 
                content: `Added \`${listInfo.title}\` to the playlist.${warning}`, 
                embeds:[{
                    title: listInfo.title,
                    description: `**Songs:** ${listInfo.estimatedItemCount}\n${listInfo.description}`,
                    thumbnail: {url: listInfo.bestThumbnail.url}
                }]
            });
        }
        interaction.editReply({
            content: `Now playing: \`${disc.title}\`${warning}`,
            embeds:[{
                title: listInfo.title,
                description: `**Songs:** ${listInfo.estimatedItemCount},\n${listInfo.description}`,
                thumbnail: {url: listInfo.bestThumbnail.url}
            }]
        });
    } else {
        // attempt search
        search(interaction, url)
    }
}

async function search(interaction, query) {
    const result = await yts(query);
    let playlist = [];
    //convert to discs
    for (const video of result.videos) {
        const videoDetails = {
            videoId: video.videoId,
            title: video.title,
            lengthSeconds: video.seconds
        }
        const disc = new Disc(video.url, {videoDetails: videoDetails})
        playlist.push(disc)
    }
    let fn = (page) => { return playlist.slice((page*5)-5, page*5) }
    const response = await menu(interaction, fn, playlist.length, "Result(s) found:", true)
    if (!response) {
        interaction.editReply({content: "**No disc chosen in time.**", ephemeral: true});
    } else {
        let jukebox = interaction.client.music.get(interaction.guildId);
        if (!jukebox){
            jukebox = new Jukebox(interaction.client, interaction.member.voice.channel);
            interaction.client.music.set(interaction.guildId, jukebox);
        }
        const discs = response.values.map((el) => playlist[Number(el)])
        let isPlaying = jukebox.addDisc(discs[0]);
        if (isPlaying){response.update({content: `Added \`${discs[0].title}\` to playlist.`, embeds: [], components: []})}
        else {response.update({content: `Now playing: \`${discs[0].title}\``, embeds: [], components: []})}
        for (const disc in discs.slice(1)){
            jukebox.addDisc(disc)
        }
    }
}


function stop(interaction){
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    jukebox.stop();
    return "Disconnected from voice channel.";
}

function playlist(interaction) {
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) {
        interaction.reply("Nothing currently playing.");
    } else {
        let fn = jukebox.getNextUp.bind(jukebox);
        menu(interaction, fn, jukebox.getTrackAmount(), "Tracks:")
    }
}

function skip(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    let amount = interaction.options.getInteger('amount')
    // skipping > 1 is untested
    const over = jukebox.skip(amount);
    if (over) {
        return "No audio left to play."
    }
    return `Skipped to next audio.`
}

function nowplaying(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    const disc = jukebox.getCurrent();
    const msg = [{
        title: disc.title,
        description: `${formatTime(Math.floor(disc.getPlayed()/1000))}/${formatTime(disc.length)}`,
        thumbnail: {url: disc.thumbnail}
    }]
    return {embeds: msg};
}

function pause(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    if (!jukebox.paused) {
        jukebox.pause()
        return "Pausing the Jukebox."
    } else {
        jukebox.unpause()
        return "Unpausing the Jukebox."
    }
}

/**
 * Creates buttons for the menu
 * 
 * @param {number} pageNum - Page number
 * @param {number} itemNum - Total number of discs
 * @returns {Discord.ActionRowBuilder}
 */
function menuButtons(pageNum, itemNum) {
    // each page has 5 items
    const prev = new Discord.ButtonBuilder()
        .setEmoji('◀️')
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel('Prev')
        .setCustomId('prev')
    const next = new Discord.ButtonBuilder()
        .setEmoji('▶️')
        .setStyle(Discord.ButtonStyle.Secondary)
        .setLabel('Next')
        .setCustomId('next');
    const page = new Discord.ButtonBuilder()
        .setEmoji('📄')
        .setStyle(Discord.ButtonStyle.Primary)
        .setCustomId('page')
        .setDisabled(true);
    if (pageNum < 2) {
        prev.setDisabled(true);
    }
    if (pageNum * 5 >= itemNum){
        next.setDisabled(true);
    }
    page.setLabel(`Page: ${pageNum}/${Math.ceil(itemNum/5)}`);
    return new Discord.ActionRowBuilder().addComponents(prev, next, page);
}

/**
 * Converts an array of discs into an array of embeds
 * 
 * @param {number} page 
 * @param {[Disc]} playlist 
 * @returns {[Discord.Embed]}
 */
function menuEmbed(page, playlist){
    return playlist.map((disc, i) => ({
        title: `${(5*(page-1)) + i + 1}. ` + disc.title,
        description: `**Duration:** ${formatTime(disc.length)}`,
        thumbnail: {url: disc.thumbnail}
    })) 
}

/**
 * Builds a selector for the menu
 * 
 * @param {number} page - The page number
 * @param {[Disc]} playlist - The discs to choose frome
 * @returns {Discord.ActionRowBuilder}
 */
function menuSelector(page, playlist){
    return new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Choose a disc!')
            .setMinValues(1)
            .setMaxValues(5)
            .addOptions(playlist.map((disc, i) => 
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(`${(5*(page-1)) + i + 1}. ` + disc.title.slice(0, 25) + "...")
                    .setValue(`${(5*(page-1)) + i}`)
    )));
}

/**
 * Handles the menu options for the jukebox, displays 5 discs at a time.
 * 
 * @param {Discord.ChatInputCommandInteraction} interaction - The interaction that triggered the menu
 * @param {(page: number)=>[Disc]} getDiscs - Function to get the next page of discs
 * @param {number} length - Number of discs to display in menu
 * @param {string} msg - Message to display before menu
 * @param {boolean} select - Whether to enable disc selection
 * @returns {Discord.StringSelectMenuInteraction | null} - Will return the disc selected if available
 */
async function menu(interaction, getDiscs, length, msg, select){
    const discs = getDiscs(1);
    const content = "**" + length + "** *" + msg + "*";
    const components = [menuButtons(1, length)];
    if (select) components.unshift(menuSelector(1, discs));
    const res = await interaction.reply({content: content, embeds: menuEmbed(1, discs), components: components});

    /**
     * Handles responses to buttons for the menu
     * @param {Discord.InteractionResponse} response 
     * @param {number} page 
     * @returns {null | Discord.StringSelectMenuInteraction}
     */
    async function buttonReplier(response, page){
        const songMsg = "**" + length + "** *" + msg + "*";
        try {
            const confirmation = await response.awaitMessageComponent({ time: MAX_RESPONSE_MS });
            if (confirmation.customId === 'prev') {page -= 1}
            else if (confirmation.customId === 'next') {page += 1}
            else if (confirmation.customId === 'select') {return confirmation}
            const discs = getDiscs(page);
            const components = [menuButtons(page, length)];
            if (select) components.unshift(menuSelector(page, discs));
            const res = await confirmation.update({content: songMsg, embeds: menuEmbed(page, discs), components: components});
            return buttonReplier(res, page);
        } catch (e) { // when out of time update buttons
            const pageButton = new Discord.ButtonBuilder()
                .setEmoji('📄')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel(`Page: ${page}/${Math.ceil(length/5)}`)
                .setCustomId('page')
                .setDisabled(true);
            const buttons = new Discord.ActionRowBuilder()
                .addComponents(pageButton);
            const discs = getDiscs(page);
            await interaction.editReply({content: songMsg, embeds: menuEmbed(page, discs), components: [buttons] });
            return null;
        }
    }
    return buttonReplier(res, 1);
}