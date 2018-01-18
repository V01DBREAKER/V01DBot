const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	const config = require("../config.json");
	var copy = message.content.substr(6);
	if (copy.startsWith(config.prefix)) {
		message.reply('I\'m not made for spamming!');
	} else if (copy === undefined) {
		message.reply('Nothing to copy...');
	} else {
		message.channel.send(copy);
		console.log(`Copied ${message.author.username} at ${message.guild.name}`);
	}
}

exports.help = {
	name: "Copy",
	category: "Fun",
	description: "Make the bot copy you!",
	usage: "\`copy [message]\`"
}
