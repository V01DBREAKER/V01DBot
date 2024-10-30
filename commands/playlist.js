const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('[WIP] Displays the song queue.'),
    aliases: ["queue"],
	async execute(interaction) {
        const jukebox = interaction.client.music.get(interaction.guildId);
        const playlist = jukebox.getNextUp();
        var body = []
        for (const disc in playlist){
            body.push({
                title: disc.title,
                thumbnail: {
                  url: disc.thumbnail
                }
            })
        }
        interaction.channel.send({embeds: body})
	},
};