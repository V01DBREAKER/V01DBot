const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytpl = require('ytpl');
const { Jukebox } = require('../utility/jukebox');
const { formatTime } = require('../utility/format');

module.exports = {
	data: new SlashCommandBuilder()
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
                .setDescription('Skips the current song.'))
        .addSubcommand(nowplaying => 
            nowplaying.setName('nowplaying')
                .setDescription('Get information about the current song.')),
	async execute(interaction) {
        await interaction.deferReply();
		const subcommand = interaction.options.getSubcommand()
        //let reply = await eval(subcommand + "(interaction)");
        switch (subcommand) { // i would use eval for this but idk tbh
            case 'play':
                reply = await play(interaction);
                break;
            case 'stop':
                reply = stop(interaction);
                break;
            case 'playlist':
                reply = playlist(interaction);
                break;
            case 'skip':
                reply = skip(interaction);
                break;
            case 'nowplaying':
                reply = nowplaying(interaction)
                break;
        }
        interaction.editReply(reply);
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

        const listInfo = await ytpl(url);
        for (const item of listInfo.items){
            jukebox.add(item.shortUrl);
        }
        return {embeds:[{
            title: listInfo.title,
            description: `**Songs:** ${listInfo.estimatedItemCount}, Description:\n${listInfo.description}`,
            thumbnail: {url: listInfo.bestThumbnail.url}
        }]}
        
    } else {
        return 'Please provide a valid YouTube URL.';
    }
}

function stop(interaction){
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    jukebox.stop();
    return "Disconnected from voice channel.";
}

function playlist(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    const playlist = jukebox.getNextUp();
    const body = [];
    for (const disc of playlist){
        body.push({
            title: disc.title,
            description: `**Duration:** ${formatTime(disc.length)}`,
            thumbnail: {
                url: disc.thumbnail
            }
        })
    };
    return {embeds: body};
}

function skip(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    const over = jukebox.skip();
    if (over) {
        return "No audio left to play."
    }
    return `Skipped to next audio.`
}

function nowplaying(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) return "Nothing currently playing.";
    const disc = jukebox.getCurrent();
    return `Currently playing: \`${disc.title}\``
}