const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, [mention, ...reason]) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	if (!message.member.hasPermission("BAN_MEMBERS")) {
		message.reply("You can't use this command.");
		return;
	}

	if (message.mentions.members.size === 0) {
		message.reply("Please mention a user to ban");
		return;
	}

	if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
		message.reply("Bot has insufficent permissions");
		console.log(`Cannot ban user because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}

	const banMember = message.mentions.members.first();
	if (!banMember.bannable) {
		message.reply(`Cannot ban ${banMember.user.username}, bot's rank is too low`);
		console.log(`Cannot ban ${banMember.user.username} because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}

	banMember.ban(reason.join(" ")).then(member => {
		message.reply(`Successfully banned ${member.user.username}`);
		console.log(`${member.user.username} at ${message.guild.name} was succesfully banned by ${message.author.username} at ${message.guild.name}`);
	});
}

exports.help = {
	name: "Ban",
	category: "Moderation",
	description: "Ban a member from the guild",
	usage: "\`ban [member(mention)] [reason]\`"
}
