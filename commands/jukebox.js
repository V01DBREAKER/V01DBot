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
                    option.setName('url-or-query')
                        .setDescription('URL or Query for a yt video.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('stop')
                .setDescription('Stops the music and disconnects the bot.'))
        .addSubcommand(subcommand => 
            subcommand.setName('playlist')
                .setDescription('Displays the song queue.'))
        .addSubcommand(subcommand => 
            subcommand.setName('skip')
                .setDescription('Skips the current song.')
                .addIntegerOption(amount => 
                    amount.setName('amount')
                        .setDescription('Number of songs to skip.')
                        .setMinValue(1)))
        .addSubcommand(subcommand => 
            subcommand.setName('nowplaying')
                .setDescription('Get information about the current song.'))
        .addSubcommand(subcommand => 
            subcommand.setName('pause')
                .setDescription('Pause or unpause the jukebox.'))
        .addSubcommand(subcommand => 
            subcommand.setName('import')
                .setDescription('Import a jukebox string or file and add to the song queue.')
                .addAttachmentOption(option =>
                    option.setName('playlist-file')
                        .setDescription('Playlist file from an export.')
                        .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName('export')
                .setDescription('Export the current song queue.')),
        
                
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
            case 'import':
                importPlaylist(interaction);
                break;
            case 'export':
                interaction.reply(exportPlaylist(interaction));
                break;
        }
        
	},
};


async function play(interaction){
    const channel = interaction.member.voice.channel;
    if (!channel) return "You must be in a voice channel!";
    if (!channel.speakable) return "Cannot join channel.";

    const url = interaction.options.getString('url-or-query')
    if (ytdl.validateURL(url)) {
        let jukebox = interaction.client.music.get(interaction.guildId);
        if (!jukebox){
            jukebox = new Jukebox(interaction.client, channel);
            interaction.client.music.set(interaction.guildId, jukebox);
        }
        const info = await ytdl.getBasicInfo(url)
        const disc = new Disc(info.videoDetails.videoId, info.videoDetails.title, info.videoDetails.lengthSeconds, info.videoDetails.author.name)
        const isPlaying = await jukebox.add(disc)
        const content = (isPlaying) ? `Added \`${disc.title}\` to playlist.` : `Now playing: \`${disc.title}\``;
        await interaction.reply(content)

    } else if (ytpl.validateID(url)) {
        // add playlist
        const id = await ytpl.getPlaylistID(url)
        addPlaylist(interaction, id);
    } else {
        // attempt search on query
        search(interaction, url)
    }
}

async function addPlaylist(interaction, id) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox){
        const channel = interaction.member.voice.channel;
        jukebox = new Jukebox(interaction.client, channel);
        interaction.client.music.set(interaction.guildId, jukebox);
    }
    // add first 5 songs to playlist and the rest to the waitlist
    const result = await yts({listId: id});
    const warning = (result.size > 100) ? "\n*More than 100 songs in playlist, only 100 will be added.*" : "";
    const first = result.videos[0];
    const firstDisc = new Disc(first.videoId, first.title, first.duration.seconds, first.author.name);
    const isPlaying = await jukebox.add(firstDisc);
    const content = isPlaying ? `Added \`${firstDisc.title}\` to the playlist.`:`Now playing: \`${firstDisc.title}\``;
    await interaction.reply({
        content: content+warning,
        embeds:[{
            title: first.title,
            description: `**Songs:** ${result.size}\n**Views:**${result.views}`,
            thumbnail: {url: firstDisc.thumbnail}
        }]
    });
    result.videos.slice(1).forEach(async (video) => {
        const disc = new Disc(video.videoId, video.title, video.duration.seconds, video.author.name);
        await jukebox.add(disc);
    })
}

async function search(interaction, query) {
    const result = await yts(query);
    const playlist = result.videos.map((video)=> new Disc(video.videoId, video.title, video.seconds, video.author.name));

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
        console.log(discs[0])
        let isPlaying = await jukebox.add(discs[0]);
        const content = isPlaying ? `Added \`${discs[0].title}\` to playlist.` : `Now playing: \`${discs[0].title}\``;
        await response.update({content: content, embeds: [], components: []})
        discs.slice(1).forEach(async (d)=>{await jukebox.add(d)})
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
        let fn = jukebox.getPage.bind(jukebox);
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
    return `Skipped to \`${jukebox.getCurrent().title}\``
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

function exportPlaylist(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    const text = jukebox.playlist.reduce((acc, disc) => acc + `${disc.id},`, "");
    const buffer = Buffer.from(text, 'utf8')
    const file = new Discord.AttachmentBuilder(buffer, {name: "ExportedPlaylist.txt"})
    return {content: "**Stream data:**", files: [file]}
}

async function importPlaylist(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply("You must be in a voice channel!");
    if (!channel.speakable) return interaction.reply("Cannot join channel.");
    interaction.deferReply();
    const attachment = interaction.options.getAttachment('playlist-file');
    try {
        const response = await fetch(attachment.url);
    
        // if there was an error send a message with the status
        if (!response.ok)
          return interaction.editReply({content: 'There was an error with fetching the file:' + response.statusText});
    
        // take the response stream and read it to completion
        const text = await response.text();
    
        if (!text) {
            return interaction.editReply('There was an error parsing the file');
        }
        let jukebox = interaction.client.music.get(interaction.guildId);
        if (!jukebox){
            jukebox = new Jukebox(interaction.client, channel);
            interaction.client.music.set(interaction.guildId, jukebox);
        }
        const ids = text.split(',').slice(0, -1)
        const video = await yts({videoId: ids[0]});
        const firstDisc = new Disc(ids[0], video.title, video.duration.seconds, video.author.name);
        const isPlaying = await jukebox.add(firstDisc);

        const content = (isPlaying) ? `Added \`${ids.length}\` to playlist.` : `Added \`${ids.length}\` to playlist and now playing: \`${firstDisc.title}\``;
        await interaction.editReply({content: content})

        ids.slice(1).forEach(async (id)=>{
            const video = await yts({videoId: id});
            const disc = new Disc(id, video.title, video.duration.seconds, video.author.name);
            await jukebox.add(disc);
        })
    } catch (error) {
        console.log(error);
    }
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
        description: `By *${disc.author}*\n**Duration:** ${formatTime(disc.length)}`,
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