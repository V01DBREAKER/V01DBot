const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
var path = require('path');
var scriptName = path.basename(__filename).split(".")[0];

exports.run = (client, message, args) => {
	var option = client.op.get(message.guild.id);
	if (option[1][option[1].findIndex(function(el){return el = scriptName})][1] == 0) return;
	message.reply('Don\'t mind me <:BirchTree:365724893054238721>')
	.then(msg => console.log(`Sent a tree joke to ${msg.author}`));
}

exports.help = {
	name: "Don\'t Mind Me I\'m A Tree",
	category: "Fun",
	description: "Throwback to when this bot was just a Minecraft bot...",
	usage: "\`dontmindmeimatree\`"
}
