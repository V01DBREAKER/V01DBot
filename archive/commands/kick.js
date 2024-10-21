const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, [mention, ...reason]) => {
	var option = client.op.get(message.guild.id)[scriptName];
	if (option != undefined && option == 0) return;
	if (!message.member.hasPermission("KICK_MEMBERS")) {
		message.reply("You can't use this command.");
		return;
	}
	if (message.mentions.members.size === 0) {
		message.reply("Please mention a user to kick");
		return;
	}
	if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
		message.reply("Bot has insufficent permissions")
		console.log(`Cannot kick user because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}
	const kickMember = message.mentions.members.first();
	if (!kickMember.kickable) {
		message.reply(`Cannot kick ${kickMember.user.username}, bot's rank is too low`);
		console.log(`Cannot kick ${kickMember.user.username} because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}
	kickMember.kick(reason.join(" ")).then(member => {
		message.reply(`Successfully kicked ${member.user.username}`);
		console.log(`${member.user.username} at ${message.guild.name} was succesfully kicked by ${message.author.username} at ${message.guild.name}`);
	});
}

exports.help = {
	name: "Kick",
	category: "Moderation",
	description: "Kick a member from the guild",
	usage: "\`kick <member(mention)> [reason]\`"
}
