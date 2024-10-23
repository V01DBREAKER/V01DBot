const dv = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const { PassThrough } = require('stream');
const cp = require('child_process');

module.exports = class Jukebox {
    constructor(client, channel){
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
        
        const { pass1: ffmpegStream, pass2: outStream } = duplicateStream(ytStream(this.playlist[0]));
        this.stream = ffmpegStream

        this.resource = dv.createAudioResource(outStream, {inlineVolume: true});
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

    addSoundEffect(effectPath) {
        const effectStream = fs.createReadStream(effectPath);      
        
        const ffmpeg = cp.spawn('ffmpeg', [
            '-i', 'pipe:0',    // First input (YouTube stream - stdin)
            '-i', 'pipe:3',    // Second input (New sound stream - stdio[3])
            '-filter_complex', '[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=3',
            '-f', 'mp3',       // output format
            'pipe:1',          // Output to stdout (Discord stream)
        ], {
            stdio: ['pipe', 'pipe', 'pipe', 'pipe'] // Define stdio pipes
        });

        this.stream.pipe(ffmpeg.stdin);
        effectStream.pipe(ffmpeg.stdio[3]);
        
        const mixedResource = dv.createAudioResource(ffmpeg.stdout, {inlineVolume: true});
        mixedResource.volume.setVolume(0.5);
        this.player.play(mixedResource);

        ffmpeg.on('error', (error) => {
            console.error(`FFmpeg error: ${error.message}`);
        });

        ffmpeg.on('close', (code) => {
            if (code !== 0) {
                console.error(`FFmpeg process exited with code ${code}`);
            }
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

function duplicateStream(originalStream) {
    const pass1 = new PassThrough();
    const pass2 = new PassThrough();

    // Pipe the original stream to both pass-throughs
    originalStream.on('data', (chunk) => {
        pass1.write(chunk);  // Write to pass1
        pass2.write(chunk);  // Write to pass2
    });

    // Handle end event
    originalStream.on('end', () => {
        pass1.end();  // Close pass1
        pass2.end();  // Close pass2
    });

    // Handle error events
    originalStream.on('error', (err) => {
        pass1.destroy(err); // Destroy pass1 on error
        pass2.destroy(err); // Destroy pass2 on error
    });

    return { pass1, pass2 };
}