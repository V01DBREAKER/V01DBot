const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
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
	if (!message.mentions.users.first()) return message.reply("Please mention a user to mute.");
	var victim = message.mentions.members.first();
	var channel = message.channel;
	var muteList = client.op.get('muted');
	var mute, i = 0;
	muteList.forEach(function(el){
		if (el[0] == victim.id){
			if (el[1] == channel.id) {
				mute = true;
				return;
			}
		}
		i++;
	})
	if (mute == undefined){
		muteList.push([victim.id, channel.id]);
		client.op.set('muted', muteList);
		message.reply(`Successfully muted ${victim.user.username} at #${channel.name}`);
		console.log(`Successfully muted ${victim.user.username} at #${channel.name}`);
	} else {
		muteList.splice(i, 1);
		client.op.set('muted', muteList);
		message.reply(`Successfully unmuted ${victim.user.username} at #${channel.name}`);
		console.log(`Successfully unmuted ${victim.user.username} at #${channel.name}`);
	}
}

exports.help = {
	name: "Mute",
	category: "Moderation",
	description: "Mutes the user in the channel",
	usage: "\`mute <@user>\`"
}
