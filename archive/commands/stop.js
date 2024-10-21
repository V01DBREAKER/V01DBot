const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	if (message.author.id !== config.ownerID) return;
	message.channel.send('Bye world! Be back as soon as my owner reactivates me!')
	console.log('Bot is shutting down...')
	client.user.setStatus('invisible')
	client.destroy();
	setTimeout(function () {
		process.exit()
	}, 5000);
}

exports.help = {
	name: "Stop",
	category: "System",
	description: "Shuts down the bot, for use by bot owner only.",
	usage: "\`stop\`"
}
