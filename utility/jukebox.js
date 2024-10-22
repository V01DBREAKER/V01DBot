const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const { PassThrough } = require('stream');
const cp = require('child_process');

module.exports = class Jukebox {
    constructor(client, channel, url){
        this.playlist = []

        this.client = client
        this.guildId = channel.guildId

        this.connection = dv.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        this.player = dv.createAudioPlayer();
        this.stream = null
        this.resource = null
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
        
        this.stream = ytStream(this.playlist[0]);
        this.resource = dv.createAudioResource(this.stream, {inlineVolume: true});
        this.resource.volume.setVolume(0.5);

        this.player.play(this.resource);
        this.connection.subscribe(this.player);
        
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

    async addSoundEffect(effectPath) {
        // if jukebox exists, something is playing
        const effect = localStream(effectPath);
        const effectResource = dv.createAudioResource(effectPath);
        const yt = this.resource.playStream;
        const ongoingPassthrough = new PassThrough();
        yt.pipe(ongoingPassthrough);

        const merge = mixStreams(ongoingPassthrough, effect);
        const mergeResource = dv.createAudioResource(merge);
        this.player.play(mergeResource); // switch to merged stream

        effectResource.playStream.on('end', () => {
            ytResource = dv.createAudioResource(this.resource.playStream)
            this.player.play(ytResource);  // Revert back to YouTube stream
        });
    }
}

function ytStream(url) {
    return ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    });
}

function localStream(filePath) {
    const stream = new PassThrough();
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(stream);
    return stream;
}

function mixStreams(ongoingStream, newStream) {
    // Create passthrough streams for both the YouTube and new sound streams
    const mergedStream = new PassThrough();

    // Setup the ffmpeg process with the necessary arguments to mix the streams
    const f = cp.spawn('ffmpeg', [
        '-i', 'pipe:3',    // First input (YouTube stream - stdin)
        '-i', 'pipe:4',    // Second input (New sound stream - stdin)
        '-filter_complex', 'amerge', // Combine both audio sources
        '-ac', '2',        // Ensure 2 audio channels (stereo)
        '-f', 's16le',     // Output format (16-bit little-endian PCM)
        '-ar', '48000',    // Audio sampling rate
        'pipe:1',          // Output to stdout (Discord stream)
    ], {
        stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe'] // Define stdio pipes
    });

    // Pipe both the YouTube and new streams into the ffmpeg process via stdin
    ongoingStream.pipe(f.stdio[3]);  // First audio input (pipe:0)
    newStream.pipe(f.stdio[4]);      // Second audio input (pipe:1)

    // Pipe the merged ffmpeg output stream to the passthrough stream
    f.stdout.pipe(mergedStream);

    // Return the merged audio stream
    return mergedStream;
}