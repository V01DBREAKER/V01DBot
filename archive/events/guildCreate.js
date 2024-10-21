const fs = require("fs");

exports.run = (client, guild) => {
	guild.channels.first().send(`Hello ${guild.name} I'm V01DBot, check out my commands using \`v!help\` or \`v!cmds\``)
}
