const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs')


class Jukebox {
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
        const info = await ytdl.getInfo(url);
        const disc = new Disc(url, info);
        this.playlist.push(disc)
        if (this.playlist.length < 2){
            this.play();
            return [false, disc];
        }
        return [true, disc];
    }
    
    async play() {
        if (this.playlist.length < 1) return null;
        
        const ytStream = this.ytStream(this.playlist[0].url);

        this.resource = dv.createAudioResource(ytStream, {inlineVolume: true});
        this.resource.volume.setVolume(0.5);

        this.player.play(this.resource);

        // set current date of disc
        this.playlist[0].setTime(Date.now());

        this.player.on(dv.AudioPlayerStatus.Idle, () => {
            this.next();
        });
        return this.playlist[0];
    }

    async stop() {
        // Disconnect the bot from the voice channel
        this.connection.destroy();  // Disconnect the bot
        this.client.music.set(this.guildId, null); // destroy jukebox
    }

    next() {
        this.playlist.shift();
        const next = this.play();
        if (!next) {
            this.stop();
        }
    }

    skip() {
        if (this.playlist.length < 2){
            this.stop();
            return true
        } else {
            this.next();
            return false
        }
    }

    ytStream(url) {
        return ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            dlChunkSize: 0,
            highWaterMark: 1 << 25
        });
    }

    getCurrent(){
        return this.playlist[0]
    }

    getNextUp(page){
        // return 5 disks of playlist
        if (this.playlist.length < 5){
            return this.playlist
        }
        return this.playlist.slice((5*page)-5, 5*page)
    }
}

class Disc {
    constructor(url, info){
        this.url = url;
        this.videoId = info.videoDetails.videoId;
        this.thumbnail = `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
        this.title = info.videoDetails.title;
        this.length = info.videoDetails.lengthSeconds;
        this.time = null; // in ms
    }

    setTime(time){
        this.time = time
    }
    getPlayed(){
        if (!this.time){
            return 0
        } else {
            return Date.now()-this.time
        }
    }
}

module.exports = {
    Jukebox,
    Disc
}