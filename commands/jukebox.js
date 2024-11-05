const path = require('node:path');
const Discord = require("discord.js");
const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytpl = require('ytpl');
const yts = require('yt-search');
const spotifyURI = require('spotify-uri')
const { Jukebox, Disc, getJukebox } = require('../utility/jukebox');
const { menu } = require('../utility/menu');
const { formatTime, tryNull } = require('../utility/utility');
const fetch = require('isomorphic-unfetch')
const spotifyFetch = require('spotify-url-info')(fetch)


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
                .setDescription('Export the current song queue.'))
        .addSubcommand(subcommand => 
            subcommand.setName('randomise')
                .setDescription('Randomise the current song queue. (Excluding the current song)')),
        
                
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
            case 'randomise':
                interaction.reply(randomise(interaction));
                break;
        }
        
	},
};


async function play(interaction){
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply("You must be in a voice channel!");
    if (!channel.speakable) return interaction.reply("Cannot join channel.");

    const url = interaction.options.getString('url-or-query')
    if (ytdl.validateURL(url)) {
        const jukebox = getJukebox(interaction);
        const info = await ytdl.getBasicInfo(url)
        const disc = new Disc(info.videoDetails.videoId, info.videoDetails.title, info.videoDetails.lengthSeconds, info.videoDetails.author.name)
        const isPlaying = jukebox.add(disc)
        const content = (isPlaying) ? `Added \`${disc.title}\` to playlist.` : `Now playing: \`${disc.title}\``;
        await interaction.reply(content)

    } else if (ytpl.validateID(url)) {
        // add playlist
        await interaction.deferReply();
        const id = await ytpl.getPlaylistID(url)
        addPlaylist(interaction, id);
    } else if (tryNull(spotifyURI.parse, url)) {
        spotify(interaction, url)
    } else {
        // attempt spotify on query
        interaction.deferReply();
        search(interaction, url)
    }
}

/**
 * Handle a yt playlist link
 * @param {Discord.ChatInputCommandInteraction} interaction 
 * @param {string} id 
 */
async function addPlaylist(interaction, id) {
    const jukebox = getJukebox(interaction);
    // add first 5 songs to playlist and the rest to the waitlist
    const result = await yts({listId: id});
    const warning = (result.size > 100) ? "\n*More than 100 songs in playlist, only 100 will be added.*" : "";
    const first = result.videos[0];
    const firstDisc = new Disc(first.videoId, first.title, first.duration.seconds, first.author.name);
    const isPlaying = jukebox.add(firstDisc);
    const content = isPlaying ? `Added \`${firstDisc.title}\` to the playlist.`:`Now playing: \`${firstDisc.title}\``;
    await interaction.editReply({
        content: content+warning,
        embeds:[{
            title: result.title,
            description: `**Author:** ${result.author.name}\n**Songs:** ${result.size}\n**Views:** ${result.views}`,
            thumbnail: {url: result.thumbnail}
        }]
    });
    result.videos.slice(1).forEach(async (video) => {
        const disc = new Disc(video.videoId, video.title, video.duration.seconds, video.author.name);
        jukebox.add(disc);
    })
}

/**
 * Handle a search query
 * @param {Discord.ChatInputCommandInteraction} interaction 
 * @param {string} query 
 */
async function search(interaction, query) {
    const result = await yts(query);
    const playlist = result.videos.map((video)=> new Disc(video.videoId, video.title, video.seconds, video.author.name));

    let fn = (page) => { return playlist.slice((page*5)-5, page*5) }
    const response = await menu(interaction, fn, playlist.length, "Result(s) found:", true)
    if (!response) {
        interaction.editReply({content: "**No disc chosen in time.**", ephemeral: true});
    } else {
        const jukebox = getJukebox(interaction);
        const discs = response.values.map((el) => playlist[Number(el)])
        let isPlaying = jukebox.add(discs[0]);
        const content = isPlaying ? `Added \`${discs[0].title}\` to playlist.` : `Now playing: \`${discs[0].title}\``;
        await response.update({content: content, embeds: [], components: []})
        discs.slice(1).forEach(async (d)=>{jukebox.add(d)})
    }
}

/**
 * Handle a spotify url
 * @param {Discord.ChatInputCommandInteraction} interaction 
 * @param {string} url 
 */
async function spotify(interaction, url) {
    const info = await tryNull(spotifyURI.parse, url)

    /**
     * Returns a Disc given a title and artists of a spotify track.
     * @param {string} title 
     * @param {[string]} artists 
     * @returns 
     */
    async function trackToDisc(title, artists) {
        const results = await yts(title + " " + artists.join(' '));
        const disc = new Disc(results.videos[0].videoId, results.videos[0].title, results.videos[0].duration.seconds, results.videos[0].author.name);
        return disc;
    }

    /**
     * Handle adding multiple tracks from a spotify link
     * @param {Discord.ChatInputCommandInteraction} interaction 
     * @param {string} url 
     * @param {spotifyURI.ParsedSpotifyUri} info 
     * @param {spotifyFetch.output} details 
     * @returns 
     */
    async function multiTrack(interaction, url, info, details = null){
        // if details not fetched yet, fetch them
        if (!details) details = await tryNull(spotifyFetch.getDetails, info.uri); 
        // if details still null, spotify url not found
        if (!details) return interaction.reply({content: `Spotify ${info.type} **${url}** not found.`, ephemeral: true}); 

        const warning = (details.tracks.length == 100) ? `\n*More than 100 songs in ${info.type}, only 100 will be added.*` : "";
        const firstDisc = await trackToDisc(details.tracks[0].name, details.tracks[0].artist.split(', '))
        const jukebox = getJukebox(interaction);
        const isPlaying = jukebox.add(firstDisc);
        const content = isPlaying ? `Added \`${firstDisc.title}\` to the playlist.`:`Now playing: \`${firstDisc.title}\``;
        await interaction.editReply({
            content: content+warning,
            embeds:[{
                title: details.preview.title,
                description: `**Songs:** ${details.tracks.length}\n**Spotify link:**\`${details.preview.link}\``,
                thumbnail: {url: details.preview.image}
            }]
        });
         details.tracks.slice(1).forEach(async (track)=>{
            const disc = await trackToDisc(track.name, track.artist.split(', '))
            jukebox.add(disc)
        });
    }

    if (info.type === "track") {
        const details = await tryNull(spotifyFetch.getPreview, info.uri)
        if (!details) return interaction.reply({content: `Spotify track *${url}* not found.`, ephemeral: true});
        await interaction.deferReply();
        const disc = await trackToDisc(details.title, details.artist.split(', '));
        const jukebox = getJukebox(interaction);
        const isPlaying = jukebox.add(disc);
        const content = (isPlaying) ? `Added \`${disc.title}\` to playlist.` : `Now playing: \`${disc.title}\``;
        await interaction.editReply(content)
    } else if (info.type === "playlist") {
        // manually search for each track in playlist
        await interaction.deferReply();
        multiTrack(interaction, url, info)
    } else if (info.type === "album") {
        const details = await tryNull(spotifyFetch.getDetails, info.uri)
        if (!details) return interaction.reply({content: `Spotify track *${url}* not found.`, ephemeral: true});
        await interaction.deferReply();
        // attempt youtube search for playlist of album 
        const results = await yts(details.preview.title + " " + details.preview.artist.split(', ').join(' ') + " album")
        if (results.lists.length > 1) {
            // allow the user to choose
            const playlist = results.lists.map((list)=> new Disc(list.listId, list.title, list.videoCount, list.author.name));
            let fn = (page) => { return playlist.slice((page*5)-5, page*5) }
            const response = await menu(interaction, fn, playlist.length, "Potential Match(es) found:", true, false)
            if (!response) {
                interaction.editReply({content: "**No playlist chosen in time.**", ephemeral: true});
            } else {
                // add the chosen playlist
                await addPlaylist(interaction, playlist[response.values[0]].id);
                interaction.editReply({components: []});
            }
        } else {
            // manually search for each track using details
            multiTrack(interaction, url, info, details)
        }
    } else {
        return interaction.reply({content: `Spotify link type: **${info.type}** currently unsupported.`, ephemeral: true})
    }
}

function stop(interaction){
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    jukebox.stop();
    return "Disconnected from voice channel.";
}

async function playlist(interaction) {
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) {
        interaction.reply("Nothing currently playing.");
    } else {
        await interaction.deferReply()
        let fn = jukebox.getPage.bind(jukebox);
        menu(interaction, fn, jukebox.getTrackAmount(), "Tracks:")
    }
}

function skip(interaction) {
    const jukebox = interaction.client.music.get(interaction.guildId);
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
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    const disc = jukebox.getCurrent();
    const msg = [{
        title: disc.title,
        description: `${formatTime(Math.floor(disc.getPlayed()/1000))}/${formatTime(disc.length)}\n${disc.getUrl()}`,
        thumbnail: {url: disc.thumbnail}
    }]
    return {embeds: msg};
}

function pause(interaction) {
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    if (!jukebox.paused) {
        jukebox.pause()
        return "Pausing the Jukebox."
    } else {
        jukebox.unpause()
        return "Unpausing the Jukebox."
    }
}

function exportPlaylist(interaction) {
    const jukebox = interaction.client.music.get(interaction.guildId);
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
        const jukebox = getJukebox(interaction)
        const ids = text.split(',').slice(0, -1)
        const video = await yts({videoId: ids[0]});
        const firstDisc = new Disc(ids[0], video.title, video.duration.seconds, video.author.name);
        const isPlaying = jukebox.add(firstDisc);

        const content = (isPlaying) ? `Added \`${ids.length}\` to playlist.` : `Added \`${ids.length}\` to playlist and now playing: \`${firstDisc.title}\``;
        await interaction.editReply({content: content})

        ids.slice(1).forEach(async (id)=>{
            const video = await yts({videoId: id});
            const disc = new Disc(id, video.title, video.duration.seconds, video.author.name);
            jukebox.add(disc);
        })
    } catch (error) {
        console.log(error);
    }
}

function randomise(interaction) {
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    jukebox.randomise();
    return {content: `**${jukebox.getTrackAmount()}** The upcoming discs have been rearranged in a **random** order`}
}