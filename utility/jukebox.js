const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');


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
        this.pauseTime = null;
        this.paused = false;
    }

    /**
     * Add disc to the jukebox, returns if jukebox is playing
     * 
     * @param {Disc} disc 
     * @returns {boolean}
     */
    add(disc) {
        this.playlist.push(disc)
        if (this.playlist.length < 2){
            this.play();
            return false;
        }
        return true;
    }
    
    async play() {
        if (this.playlist.length < 1) return null;
        
        const ytStream = this.ytStream("https://www.youtube.com/watch?v=" + this.playlist[0].id);

        this.resource = dv.createAudioResource(ytStream, {inlineVolume: true});
        this.resource.volume.setVolume(0.5);

        this.player.play(this.resource);

        this.player.removeAllListeners(dv.AudioPlayerStatus.Idle)
        this.player.removeAllListeners('error')
        // set current date of disc
        this.player.once(dv.AudioPlayerStatus.Playing, () => {
            this.playlist[0].setTime(Date.now());
        })
        this.player.on(dv.AudioPlayerStatus.Idle, () => {
            this.next();
        });
         // if theres an issue playing, play the next song
        this.player.on('error', error => {
            console.log(error);
            //this.next();
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

    async next() {
        this.playlist.shift();
        const next = await this.play();
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

    /**
     * Returns currently playing Disc
     * @returns {Disc}
     */
    getCurrent(){
        return this.playlist[0];
    }

    getPage(page){
        return this.playlist.slice((5*page)-5, 5*page)
    }

    getTrackAmount(){
        return this.playlist.length;
    }
}

class Disc {
    /**
     * Represents a disc in the jukebox
     * @param {string} id - yt id
     * @param {string} title - disc title
     * @param {number} seconds - disc length in seconds
     * @param {string} author - disc author
     */
    constructor(id, title, seconds, author){
        this.id = id;
        this.thumbnail = `https://i.ytimg.com/vi/${this.id}/maxresdefault.jpg`;
        this.title = title;
        this.length = seconds;
        this.author = author;
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

    /**
     * Get yt URL of disc
     * @returns string
     */
    getUrl(){
        return "https://www.youtube.com/watch?v=" + this.id;
    }
}

/**
 * Get the jukebox for the guild the interaction was sent in.
 * Creates a jukebox if none is given
 * 
 * @param {Discord.ChatInputCommandInteraction} interaction 
 * @returns {Jukebox}
 */
function getJukebox(interaction) {
    let jukebox = interaction.client.music.get(interaction.guildId);
    if (!jukebox){
        jukebox = new Jukebox(interaction.client, interaction.member.voice.channel);
        interaction.client.music.set(interaction.guildId, jukebox);
    }
    return jukebox
}

module.exports = {
    Jukebox,
    Disc,
    getJukebox
}