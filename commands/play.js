const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const Jukebox = require('../utility/jukebox');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('[WIP] Plays a yt video')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL to the yt video')
                .setRequired(true)
        ),
	async execute(interaction) {
        const sound = await playYT(interaction);
		await interaction.reply(sound);
	},
};

async function playYT(interaction){
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
    
    let [inQueue, title] = await jukebox.add(streamURL)
    console.log(jukebox.playlist)
    if (inQueue){
        return `Added \`${title}\` to playlist.`
    }
    return `Now playing: \`${title}\``;
}