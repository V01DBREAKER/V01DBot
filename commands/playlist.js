const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('[WIP] Displays the song queue.'),
    aliases: ["queue"],
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
	},
};