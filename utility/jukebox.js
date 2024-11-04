const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs')


class Jukebox {
    constructor(client, channel){
        this.playlist = [] // try to keep at least 5 tracks as disks ( can have more or less )
        this.waitlist = [] // rest of the tracks as urls

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
        this.pauseTime = null;
        this.paused = false;
    }

    async add(url) {
        const info = await ytdl.getBasicInfo(url);
        const disc = new Disc(url, info);
        return [this.addDisc(disc), disc]
    }

    addDisc(disc) {
        this.playlist.push(disc)
        if (this.playlist.length < 2){
            this.play();
            return false;
        }
        return true;
    }

    async addPlaylist(list){
        if (this.playlist.length < 1) {
            out = await this.add(list.shift());
        } else {
            out = [true, null]
        }
        let len = this.playlist.length
        while (len < 5){
            this.add(list.shift());
            len += 1;
        }
        this.waitlist = this.waitlist.concat(list)
        return out
    }
    
    async play() {
        if (this.playlist.length < 1) return null;
        
        const ytStream = this.ytStream(this.playlist[0].url);

        this.resource = dv.createAudioResource(ytStream, {inlineVolume: true});
        this.resource.volume.setVolume(0.5);

        this.player.play(this.resource);

        // set current date of disc
        this.player.once(dv.AudioPlayerStatus.Playing, () => {
            this.playlist[0].setTime(Date.now());
        })
        this.player.on(dv.AudioPlayerStatus.Idle, () => {
            this.next();
        });
         // if theres an issue playing, play the next song
        this.player.on('error', error => {
            console.log(typeof(e));
            this.next();
        })
        return this.playlist[0];
    }

    pause() {
        this.paused = true;
        this.player.pause()
        this.pauseTime = Date.now()
    }
    unpause() {
        this.paused = false;
        this.player.unpause()
        this.playlist[0].addPauseTime(Date.now() - this.pauseTime)
        this.pauseTime = null;
    }

    stop() {
        // Disconnect the bot from the voice channel
        this.connection.destroy();  // Disconnect the bot
        this.client.music.set(this.guildId, null); // destroy jukebox
    }

    next() {
        this.playlist.shift();
        if (this.waitlist.length > 1){
            this.add(this.waitlist[0]);
            this.waitlist.shift();
        }
        const next = this.play();
        if (!next) {
            this.stop();
        }
    }

    skip(amount) {
        if (this.playlist.length < 2){
            this.stop();
            return true;
        } else if (amount) {
            if (this.getTrackAmount() <= amount){
                this.stop();
                return true;
            }
            if (amount >= this.playlist.length){
                this.waitlist = this.waitlist.slice(amount-this.playlist.length);
                this.playlist = [];
                // add 5 next tracks to playlist
                for (const disc of this.waitlist.slice(0, 5)) {
                    this.add(disc);
                }
                this.waitlist = this.waitlist.slice(5);
            } else {
                // slice to amount -1 to compensate for next()'s shift
                this.playlist = this.playlist.slice(amount-1) ;
                this.next();
            }
            return false;
        } else {
            this.next();
            return false;
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
        // append the next 5 to the playlist
        for (const url of this.waitlist.slice(0, 5)){
            this.add(url);
        }
        this.waitlist = this.waitlist.slice(5);
        return this.playlist.slice((5*page)-5, 5*page)
    }

    getTrackAmount(){
        return this.playlist.length + this.waitlist.length;
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
        this.pauseTime = 0; // in mis
    }

    setTime(time){
        this.time = time
    }
    getPlayed(){
        if (!this.time){
            return 0
        } else {
            return Date.now() - this.time - this.pauseTime
        }
    }
    addPauseTime(time){
        this.pauseTime += time
    }
}

module.exports = {
    Jukebox,
    Disc
}