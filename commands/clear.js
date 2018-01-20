const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	var deleteCount = parseInt(args[0], 10);
	if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
		message.reply("Bot has insufficent permissions")
		.then(mes => mes.delete(5000));
		console.log(`Cannot delete messages because insufficent permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	} else if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
		message.reply("Bot has insufficent permissions in channel")
		.then(mes => mes.delete(5000));
		console.log(`Cannot delete messages because insufficent channel permissions by ${message.author.username} at ${message.guild.name}`);
		return;
	}
	if (message.member.hasPermission("MANAGE_MESSAGES")) {
		if (deleteCount <= 0 || deleteCount == undefined) {
			message.channel.fetchMessages()
				.then(function(list){
					message.channel.bulkDelete(list).catch(O_o=>{});
					message.channel.send('Deleted 14 days worth of messages')
					.then(mes => mes.delete(5000));
					console.log(`Deleted 14 days worth of messages at ${message.guild.name} initiated by ${message.author.username}`);
				});
		} else {
			message.channel.fetchMessages({limit: deleteCount})
				.then(function(list){
					message.channel.bulkDelete(list).catch(O_o=>{});
					message.channel.send(`Deleted ${deleteCount} messages`)
					.then(mes => mes.delete(5000));
					console.log(`Deleted ${deleteCount} message(s) at ${message.guild.name} initiated by ${message.author.username}`);
				});
		};
	};
}

exports.help = {
	name: "Clear",
	category: "Moderation",
	description: "Clears the chat of a number of messages specified by a moderator with the \`MANAGE_MESSAGES\` permission.",
	usage: "\`clear [number]\`"
}
