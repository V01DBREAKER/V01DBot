
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	let i = 0, slowIf;
	var option = client.op.get(message.guild.id)[scriptName];
	if (option != undefined && option == 0) return;

	if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
		message.reply("Bot has insufficent permissions")
		return;
	}
	if (!message.member.hasPermission("MANAGE_MESSAGES")) {
		message.reply("You do not have MANAGE MESSAGES permission")
		return;
	}
	// "slow", [[channel.id, user.id], [channel.id, user.id]]
	var slow = client.op.get('slow')
	if (slow == undefined) {
		client.op.set("slow", "[[]]")
	}
	slow.forEach(function(el){
		if (el[0] == message.channel.id) {
			slowIf = true;
			return;
		}
		i++;
	})
	if (slowIf == true) {
		slow.splice(i, 1);
		client.op.set('slow', slow);
		message.reply("Chat returned to normal speed.")
	} else {
		if (args[0] == undefined) {
			message.reply("Please specify how slow the chat is to be.\nUsage:`v!slow [speed of chat in seconds]`")
			return;
		}
		if (!isNumeric(args[0])) {
			message.reply("Please state a number for the speed of chat.")
			return;
		}
		slow.push([message.channel.id, args[0]])
		message.reply("Chat is now *slllloooowwww*.")
	}
}

exports.help = {
	name: "Slow",
	category: "Moderation",
	description: "Slow down the chat to a message every 5 seconds!",
	usage: "\`slow\`"
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
