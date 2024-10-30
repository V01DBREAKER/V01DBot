const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('@distube/ytdl-core');
const dv = require('@discordjs/voice');
const fs = require('fs');
const { PassThrough } = require('stream');
const cp = require('child_process');
const { formatTime } = require('../utility/format')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tse')
		.setDescription('testmixingsounds')
        .addBooleanOption(option =>
            option.setName('stop')
                .setDescription('Whether to stop')
        ),
	async execute(interaction) {

        const jukebox = interaction.client.music.get(interaction.guildId);
        if (!jukebox){
            await interaction.reply("Nothing playing at the moment.")
            return;
        }
        const playlist = jukebox.getNextUp();
        const body = [];
        for (const disc of playlist){
            console.log(playlist)
            body.push({
                title: disc.title,
                description: `**Duration:** ${formatTime(disc.length)}`,
                thumbnail: {
                    url: disc.thumbnail
                }
            })
        };
        await interaction.reply({embeds: body});
        return;

        /// command for testing overlaying sounds on demand
        // currently not working
        if (interaction.options.getBoolean('stop') == true) {
            const connection = dv.getVoiceConnection(interaction.member.voice.channel.guild.id);
            if (connection) {
                connection.destroy();  // Disconnect the bot
            }
            interaction.reply("stopped")

        } else {
            const connection = dv.joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.member.voice.channel.guild.id,
                adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator
            });

            const ytStream = ytdl("https://www.youtube.com/watch?v=ChukpOHfAI8", {filter: 'audioonly',quality: 'highestaudio',highWaterMark: 1 << 25});
            
            const outStream = new PassThrough();
            let effect = false
            const ffmpeg = cp.spawn('ffmpeg', [
                '-i', 'pipe:0',    // First input (YouTube stream - stdin)
                '-i', 'pipe:3',    // Second input (New sound stream - stdio[3])
                '-filter_complex', '[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=3',
                '-f', 'mp3',       // output format
                'pipe:1',          // Output to stdout (Discord stream)
            ], {
                stdio: ['pipe', 'pipe', 'pipe', 'pipe'] // Define stdio pipes
            });

            ytStream.pipe(ffmpeg.stdin);
            outStream.pipe(ffmpeg.stdio[3]);
            ytStream.on('data', (chunk) => {
                if (!effect) {
                    outStream.write(chunk)
                }
            })
            setTimeout(()=>{
                effect = true
                console.log("duck")
                const effectStream = fs.createReadStream("D:\\Coding\\V01DBot\\assets\\fart.mp3");
                effectStream.pipe(outStream)
                effectStream.on('data', (chunk) => {
                    outStream.write(chunk)
                })
            }, 5000)
            const resource = dv.createAudioResource(ffmpeg.stdout, {inlineVolume: true});
            resource.volume.setVolume(0.5);

            const player = dv.createAudioPlayer();
            player.play(resource)
            connection.subscribe(player)

            connection.on('stateChange', (state)=>{
                if (state == dv.VoiceConnectionStatus.Destroyed) {
                    ffmpeg.kill()
                }
            })

            await interaction.reply("Playing...");
        }
	},
    isAdmin: true
};