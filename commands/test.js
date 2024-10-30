const { SlashCommandBuilder } = require('discord.js');
const { formatTime } = require('../utility/format')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('testingstuff')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('generic option')
        ),

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
    isAdmin: true
};