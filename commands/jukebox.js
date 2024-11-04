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
            return { 
                content: `Added \`${listInfo.title}\` to the playlist.${warning}`, embeds:[{
                    title: listInfo.title,
                    description: `**Songs:** ${listInfo.estimatedItemCount}\n${listInfo.description}`,
                    thumbnail: {url: listInfo.bestThumbnail.url}
                }]}
        }
        return {
            content: `Now playing: \`${disc.title}\`${warning}`, embeds:[{
            title: listInfo.title,
            description: `**Songs:** ${listInfo.estimatedItemCount},\n${listInfo.description}`,
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
        const embed = await playlistEmbed(1, jukebox)
        const msg = "**" + jukebox.getTrackAmount() + "** *Tracks:*";
        const res = await interaction.reply({content: msg, embeds: embed, components: playlistButtons(1, jukebox.getTrackAmount())});
        async function buttonReplier(response, page){
            const songMsg = "**" + jukebox.getTrackAmount() + "** *Tracks:*";
            try {
                const confirmation = await response.awaitMessageComponent({ time: 60_000 });
                if (confirmation.customId === 'prev') {
                    const embed = await playlistEmbed(page-1, jukebox)
                    const res = await confirmation.update({content: songMsg, embeds: embed, components: playlistButtons(page-1, jukebox.getTrackAmount())});
                    buttonReplier(res, page-1);
                } else if (confirmation.customId === 'next') {
                    const embed = await playlistEmbed(page+1, jukebox)
                    const res = await confirmation.update({content: songMsg, embeds: embed, components: playlistButtons(page+1, jukebox.getTrackAmount())});
                    buttonReplier(res, page+1);
                }
            } catch (e) {
                const pageButton = new ButtonBuilder()
                    .setEmoji('📄')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`Page: ${page}/${Math.ceil(jukebox.getTrackAmount()/5)}`)
                    .setCustomId('page')
                    .setDisabled(true);
                const row = new ActionRowBuilder()
                    .addComponents(pageButton);
                const embed = await playlistEmbed(page, jukebox)
                await interaction.editReply({content: songMsg, embeds: embed, components: [row] });
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
    if (pageNum * 5 >= itemNum){
        next.setDisabled(true);
    }
    page.setLabel(`Page: ${pageNum}/${Math.ceil(itemNum/5)}`);
    const row = new ActionRowBuilder()
        .addComponents(prev, next, page);
    return [row]
}

async function playlistEmbed(page, jukebox){
    const playlist = await jukebox.getNextUp(page);
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