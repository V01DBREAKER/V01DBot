const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	var copy = args.toString();
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
