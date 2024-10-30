const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
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
                .setDescription('[WIP] Displays the song queue.')),
	async execute(interaction) {
        await interaction.deferReply();
        let reply;
		const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case 'play':
                reply = await play(interaction);
                break;
            case 'stop':
                reply = stop(interaction);
                break;
            case 'playlist':
                reply = playlist(interaction)
                break;
        }
        interaction.editReply(reply);
	},
};

async function play(interaction){
    const channel = interaction.member.voice.channel;
    if (!channel) return "You must be in a voice channel!";
    if (!channel.speakable) return "Cannot join channel.";

    const streamURL = interaction.options.getString('url')
    if (!ytdl.validateURL(streamURL)) {
        return 'Please provide a valid YouTube URL.';
    }
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox){
        jukebox = new Jukebox(interaction.client, channel);
        interaction.client.music.set(interaction.guildId, jukebox);
    }
    
    let [isPlaying, disc] = await jukebox.add(streamURL)
    if (isPlaying){
        return `Added \`${disc.title}\` to playlist.`
    }
    return `Now playing: \`${disc.title}\``;
}

function stop(interaction){
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox){
        return "Nothing currently playing.";
    } else {
        jukebox.stop();
        return "Disconnected from voice channel.";
    }
}

function playlist(interaction){
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox){
        return "Nothing playing at the moment.";
    }
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
    interaction.channel.send({embeds: body})
    return "In queue:";
}