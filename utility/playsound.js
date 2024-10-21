const path = require('node:path');
const dv = require('@discordjs/voice');

module.exports = {
    playSound(interaction, sound){
        const channel = interaction.member.voice.channel;
        if (!channel) return [false, "You must be in a voice channel!"];
        if (!channel.speakable) return [false, `Cannot play sound: ${sound}`];

        const connection = dv.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        console.log(`Connected to voice channel: ${channel.id}`);

        const player = dv.createAudioPlayer();
        const audioFile = path.join(__dirname, '../assets', sound + '.mp3');
        const resource = dv.createAudioResource(audioFile);

        player.play(resource)

        connection.subscribe(player)
        
        player.on(dv.AudioPlayerStatus.Idle, () => {
            console.log('Audio has finished playing, disconnecting...');
            
            // Disconnect the bot from the voice channel
            const connection = dv.getVoiceConnection(channel.guild.id);
            if (connection) {
                connection.destroy();  // Disconnect the bot
            }
        });

        return [true, "Played sound in chat."]
    }
}
