const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const { channel } = require('diagnostics_channel');

module.exports = class Jukebox {
    constructor(client, channel, url){
        this.playlist = []
        this.playing = false

        this.client = client
        this.guildId = channel.guildId

        this.connection = dv.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        this.player = dv.createAudioPlayer();

        console.log(`Created jukebox at: ${channel.id}`);
    }

    async add(url) {
        this.playlist.push(url)
        console.log(this.playlist)
        if (!this.playing){
            const title = await this.play()
            return [false, title];
        }
        const info = await ytdl.getInfo(streamURL);
        return [true, info.videoDetails.title];
    }
    
    async play() {
        if (this.playlist.length < 1) return null;
        const stream = ytdl(playlist[0], {
            filter: 'audioonly',  // Only get the audio stream
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });
        const resource = dv.createAudioResource(stream, {inlineVolume: true});
        resource.volume.setVolume(0.5);

        this.player.play(resource);

        connection.subscribe(this.player);
        
        this.player.on(dv.AudioPlayerStatus.Idle, () => {
            this.playlist.shift();
            next = play(channel);
            if (!next) {
                // Disconnect the bot from the voice channel
                this.connection.destroy();  // Disconnect the bot
                this.client.music.set(this.guildId, null);
            }
        });
        const info = await ytdl.getInfo(streamURL);
        return info.videoDetails.title;
    }
}