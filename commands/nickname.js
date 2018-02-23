const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) {
		message.reply("Bot has insufficent permissions");
		console.log(`Cannot nickname user because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}

	if (message.member.nickname) {
		var n = message.member.nickname;
	} else {
		var n = message.author.username;
	}

	var name = n.split('');
	for (i = 0;i < n.length;i++) {
		let nick = name.shift();
		name.push(nick)
		let nameNick = name.join('')
		message.member.setNickname(nameNick)
	}
	message.reply("Woah your name is impressive!")
}

exports.help = {
	name: "Nickname",
	category: "Fun",
	description: "Make your nickname look cool!",
	usage: "\`nickname\`"
}
