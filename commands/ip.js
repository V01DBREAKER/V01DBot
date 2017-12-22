const publicIp = require('public-ip');
const config = require('../config.json');

exports.run = (client, message, args) => {
	if (args.length >= 1) return
	if (message.author.id === config.PiUsers.Adrian || message.author.id === config.PiUsers.Aiden || message.author.id === config.PiUsers.Anthony) {
  	publicIp.v4().then(ip => {
			message.reply(ip);
		});
	}
}

exports.help = {
	name: "IP",
	category: "System",
	description: "Displays the ip of the bot's server",
	usage: "\`ip\`"
}
