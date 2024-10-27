const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

module.exports = class Jukebox {
    constructor(client, channel){
        this.playlist = []

        this.client = client
        this.guildId = channel.guildId

        this.player = dv.createAudioPlayer();

        this.connection = dv.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        this.connection.subscribe(this.player);
        console.log(`Created jukebox at: ${channel.id}`);
    }

    async add(url) {
        this.playlist.push(url)
        if (this.playlist.length < 2){
            const title = await this.play()
            return [false, title];
        }
        const info = await ytdl.getInfo(url);
        return [true, info.videoDetails.title];
    }
    
    async play() {
        if (this.playlist.length < 1) return null;
        
        const ytStream = this.ytStream(this.playlist[0]);

        this.resource = dv.createAudioResource(ytStream, {inlineVolume: true});
        this.resource.volume.setVolume(0.5);

        this.player.play(this.resource);

        this.player.on(dv.AudioPlayerStatus.Idle, () => {
            this.playlist.shift();
            const next = this.play();
            if (!next) {
                this.stop()
            }
        });
        const info = await ytdl.getInfo(this.playlist[0]);
        return info.videoDetails.title;
    }

    async stop() {
        // Disconnect the bot from the voice channel
        this.connection.destroy();  // Disconnect the bot
        this.client.music.set(this.guildId, null); // destroy jukebox
    }

    ytStream(url) {
        return ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });
    }
}