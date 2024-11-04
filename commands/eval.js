const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Arbitrary code evaluation.')
		.addStringOption(option =>
            option.setName('input')
                .setDescription('Arbitrary code')
				.setRequired(true)
        ),
	async execute(interaction) {
		if(interaction.member.id !== ownerId) return;
    	try {
			const code = interaction.options.getString('input');
			let evaled = eval(code);
			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);
			interaction.reply(clean(evaled), {code:"xl"});
		} catch (err) {
			interaction.reply(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	},
	isAdmin: true
};

function clean(text) {
	if (typeof(text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}