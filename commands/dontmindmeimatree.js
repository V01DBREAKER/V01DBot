const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	message.reply('Don\'t mind me <:BirchTree:365724893054238721>')
	.then(msg => console.log(`Sent a tree joke to ${msg.author}`));
}

exports.help = {
	name: "Don\'t Mind Me I\'m A Tree",
	category: "Fun",
	description: "Throwback to when this bot was just a Minecraft bot...",
	usage: "\`dontmindmeimatree\`"
}
