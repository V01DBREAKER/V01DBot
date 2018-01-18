const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
	if(args.length > 1) return
	message.reply(':cookie:')
	console.log(`Sent a cookie to ${message.author}`));
}

exports.help = {
	name: "Cookie",
	category: "Fun",
	description: "Send a cookie to the chat!",
	usage: "\`cookie\`"
}
