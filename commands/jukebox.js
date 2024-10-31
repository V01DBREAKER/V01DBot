const path = require('node:path');
const { ActionRowBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
		const subcommand = interaction.options.getSubcommand()
        //let reply = await eval(subcommand + "(interaction)");
        switch (subcommand) { // i would use eval for this but idk tbh
            case 'play':
                await interaction.deferReply();
                const reply = await play(interaction);
                interaction.editReply(reply);
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

        const listInfo = await ytpl(url);
        for (const item of listInfo.items){
            jukebox.add(item.shortUrl); // playlist > 20 issue (slow)
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

async function playlist(interaction) {
    const jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox) {
        await interaction.reply("Nothing currently playing.");
    } else {
        const numDiscs = jukebox.playlist.length;
        const res = await interaction.reply({embeds: playlistEmbed(1, jukebox), components: playlistButtons(1, numDiscs)});
        async function buttonReplier(response, page){
            try {
                const confirmation = await response.awaitMessageComponent({ time: 60_000 });
                if (confirmation.customId === 'prev') {
                    const res = await confirmation.update({embeds: playlistEmbed(page-1, jukebox), components: playlistButtons(page-1, numDiscs)});
                    buttonReplier(res, page-1);
                } else if (confirmation.customId === 'next') {
                    const res = await confirmation.update({embeds: playlistEmbed(page+1, jukebox), components: playlistButtons(page+1, numDiscs)});
                    buttonReplier(res, page+1);
                }
            } catch (e) {
                const pageButton = new ButtonBuilder()
                    .setEmoji('📄')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`Page: ${page}`)
                    .setCustomId('page')
                    .setDisabled(true);
                const row = new ActionRowBuilder()
                    .addComponents(pageButton);
                await interaction.editReply({embeds: playlistEmbed(page, jukebox), components: [row] });
            }
        }
        buttonReplier(res, 1);
    }
}

function playlistButtons(pageNum, itemNum) {
    // each page has 5 items
    const prev = new ButtonBuilder()
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Prev')
        .setCustomId('prev')
    const next = new ButtonBuilder()
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Next')
        .setCustomId('next');
    const page = new ButtonBuilder()
        .setEmoji('📄')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('page')
        .setDisabled(true);
    if (pageNum < 2) {
        prev.setDisabled(true);
    }
    if (pageNum * 5 > itemNum){
        next.setDisabled(true);
    }
    page.setLabel(`Page: ${pageNum}`);
    const row = new ActionRowBuilder()
        .addComponents(prev, next, page);
    return [row]
}

function playlistEmbed(page, jukebox){
    const playlist = jukebox.getNextUp(page);
    const discs = [];
    // add disc embed per playlist
    for (const disc of playlist){
        discs.push({
            title: disc.title,
            description: `**Duration:** ${formatTime(disc.length)}`,
            thumbnail: {url: disc.thumbnail}
        })
    };
    return discs
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
    const msg = [{
        title: disc.title,
        description: `${formatTime(Math.floor(disc.getPlayed()/1000))}/${formatTime(disc.length)}`,
        thumbnail: {url: disc.thumbnail}
    }]
    return {embeds: msg};
}